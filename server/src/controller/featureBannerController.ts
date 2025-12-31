import { Response } from "express";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";
import asyncHandler from "../utils/asyncHandler";
import winstonLogger from "../utils/winstonLogger";
import { deleteImages, uploadImages } from "../utils/uploadImages";

// Create
const createFeatureBanner = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const files = (req.files as Express.Multer.File[]) || [];
    // 1️⃣ Validate uploaded files
    if (!files || files.length === 0) {
        return res.status(400).json("No files uploaded");
    }

    // 2️⃣ Upload to Cloudinary
    const bannerUrls = await uploadImages(files, "ecommerce-feature-banners");

    // 3️⃣ Save to DB
    const banners = await Promise.all(
        bannerUrls.map(async (banner, index) => {
            return await prisma.featuredBanner.create({
                data: {
                    url: banner.url,
                    publicId: banner.publicId,
                    sortOrder: index + 1
                }
            })
        }))

    // 4️⃣ Response
    return res.status(201).json({
        message: "Feature Banner created successfully",
        data: banners.map(item => {
            return {
                id: item.id,
                url: item.url,
                publicId: item.publicId,
            }
        })
    });

})

const updateFeatureBanner = asyncHandler(async (req: AuthenticateRequest, response: Response) => {
    // 1️⃣ Validate uploaded files
    const files = (req.files as Express.Multer.File[]) || [];

    const bannerOrder = JSON.parse(req.body.bannerOrder || "[]");
    const deletedImageIds = JSON.parse(req.body.deletedImageIds || "[]");

    // 1. Delete old images 
    if (deletedImageIds.length > 0) {
        await deleteImages(deletedImageIds);
        await prisma.featuredBanner.deleteMany({
            where: { publicId: { in: deletedImageIds } }
        })
    }

    // 2. upload new images (files contain tempId from FE) 
    const uploads = await Promise.all(files.map(async (file) => {
        const uploaded = await uploadImages([file], "ecommerce-feature-banners");
        return {
            tempId: file.originalname,
            url: uploaded[0].url,
            publicId: uploaded[0].publicId
        }
    }))

    // 3. Create DB entries for new images
    let tempToRealMap: Record<string, string> = {};
    await Promise.all(
        uploads.map(async (item) => {
            const created = await prisma.featuredBanner.create({
                data: {
                    url: item.url,
                    publicId: item.publicId,
                    sortOrder: 9999 // temp, will fix below
                }
            })
            tempToRealMap[item.tempId] = created.id;
        }))

    // 4. Replace tempId with realId in bannerOrder
    const finalSortedList = bannerOrder.map((item: any) => ({
        id: tempToRealMap[item.id] || item.id,
        sortOrder: item.sortOrder
    }))

    // 5. Update sortOrder for all
    await Promise.all(
        finalSortedList.map((item: { id: string; sortOrder: number }) =>
            prisma.featuredBanner.update({
                where: { id: item.id },
                data: { sortOrder: item.sortOrder },
            }).catch(() => {
                // ignore updating missing items → prevents runtime crash
                console.warn("Skipping missing banner:", item.id);
            })
        )
    );

    // 6️⃣ Return ONLY the final banner records (clean result)
    const finalBanners = await prisma.featuredBanner.findMany({
        orderBy: { sortOrder: 'asc' }
    });


    return response.status(200).json({
        message: "Feature Banner updated successfully",
        data: finalBanners
    });

});



// READ ALL

const getAllFeatureBanner = asyncHandler(async (req: AuthenticateRequest, response: Response) => {
    const featureBanners = await prisma.featuredBanner.findMany({
        orderBy: {
            sortOrder: "asc",
        },
    });
    return response.status(200).json({ data: featureBanners });
});

// DELETE

const deleteFeatureBanner = asyncHandler(async (req: AuthenticateRequest, response: Response) => {
    const id = req.params.id;
    if (!id) {
        return response.status(400).json({ message: "Id is required" });
    }

    const featureBanner = await prisma.featuredBanner.findUnique({
        where: { id }
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
        where: { id }
    });
    return response.status(200).json({ message: "Feature Banner deleted successfully" });
})

export {
    createFeatureBanner,
    getAllFeatureBanner,
    deleteFeatureBanner,
    updateFeatureBanner
}