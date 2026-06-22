import { Response } from "express";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";
import asyncHandler from "../utils/asyncHandler";
import winstonLogger from "../utils/winstonLogger";
import { deleteImages, uploadImages } from "../utils/uploadImages";
import { invalidateBannerCache } from "../utils/invalidateCache/invalidateBannerCache";

interface BannerData {
  id: string;
  redirectUrl: string;
  sortOrder: number;
}

const updateFeatureBanner = asyncHandler(
  async (req: AuthenticateRequest, response: Response) => {
    console.log("updateFeatureBanner handler");
    // Validate uploaded files
    const files = (req.files as Express.Multer.File[]) || [];

    const bannerData: {
      id: string;
      redirectUrl: string;
      sortOrder: number;
    }[] = JSON.parse(req.body.bannerData || "[]");

    const deletedImageIds = JSON.parse(req.body.deletedImageIds || "[]");
    const existingBannersRedirectUrlChange = JSON.parse(
      req.body.existingBannersRedirectUrlChange || "[]",
    );

    let finalBanners;
    let uploads: { url: string; publicId: string; fileName: string }[] = [];
    try {
      // upload new images in cloudinary
      uploads = await Promise.all(
        files.map(async (file) => {
          const uploaded = await uploadImages(
            [file],
            "ecommerce-feature-banners",
          );
          return {
            url: uploaded[0].url,
            publicId: uploaded[0].publicId,
            fileName: file.originalname,
          };
        }),
      );
      finalBanners = await prisma.$transaction(async (tx) => {
        // 1. Delete old images
        if (deletedImageIds.length > 0) {
          await tx.featuredBanner.deleteMany({
            where: { publicId: { in: deletedImageIds } },
          });
        }
        // 2. update redirectUrl if payload available
        if (existingBannersRedirectUrlChange.length > 0) {
          await Promise.all(
            existingBannersRedirectUrlChange.map((item: BannerData) =>
              tx.featuredBanner.update({
                where: { id: item.id },
                data: {
                  redirectUrl: item.redirectUrl,
                  sortOrder: item.sortOrder,
                },
              }),
            ),
          );
        }

        // 3. Create DB entries for new images
        await Promise.all(
          uploads.map(async (item) => {
            const banner = bannerData.find(
              (b: { id: string }) => b.id === item.fileName,
            );

            if (!banner) {
              throw new Error(`Banner metadata not found for ${item.fileName}`);
            }

            await tx.featuredBanner.create({
              data: {
                id: item.fileName,
                url: item.url,
                publicId: item.publicId,
                sortOrder: banner.sortOrder,
                redirectUrl: banner.redirectUrl,
              },
            });
          }),
        );

        // 6. Return ONLY the final banner records
        return await tx.featuredBanner.findMany({
          orderBy: { sortOrder: "asc" },
        });
      });
    } catch (e) {
      winstonLogger.error("Feature Banner update failed", e);
      if (uploads.length > 0) {
        await deleteImages(uploads.map((item) => item.publicId));
      }
      throw e;
    }

    // Transaction succeeded.
    // Best-effort cleanup of old Cloudinary images.
    try {
      if (deletedImageIds.length > 0) {
        await deleteImages(deletedImageIds);
      }
    } catch (e) {
      winstonLogger.error("Failed to delete old Cloudinary images", e);
    }
    // * Invalidate banner cache
    await invalidateBannerCache();
    return response.status(200).json({
      message: "Feature Banner updated successfully",
      data: finalBanners,
    });
  },
);

// READ ALL

const getAllFeatureBanner = asyncHandler(
  async (req: AuthenticateRequest, response: Response) => {
    const featureBanners = await prisma.featuredBanner.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
    return response.status(200).json({ data: featureBanners });
  },
);

// DELETE

const deleteFeatureBanner = asyncHandler(
  async (req: AuthenticateRequest, response: Response) => {
    const id = req.params.id;
    if (!id) {
      return response.status(400).json({ message: "Id is required" });
    }

    const featureBanner = await prisma.featuredBanner.findUnique({
      where: { id },
    });

    if (!featureBanner) {
      return response.status(404).json({ message: "Feature Banner not found" });
    }

    // delete from cloudinary
    if (featureBanner.publicId) {
      try {
        const result = await deleteImages([featureBanner.publicId]);
        winstonLogger.info("Cloudinary delete:", result);
      } catch (error) {
        winstonLogger.error("Cloudinary deletion failed", error);
      }
    }

    await prisma.featuredBanner.delete({
      where: { id },
    });
    return response
      .status(200)
      .json({ message: "Feature Banner deleted successfully" });
  },
);

export {
  //   createFeatureBanner,
  getAllFeatureBanner,
  deleteFeatureBanner,
  updateFeatureBanner,
};
