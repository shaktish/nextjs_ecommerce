import cloudinary from "../config/cloudinary";
import fs from "fs/promises";
import winstonLogger from "./winstonLogger";

export const uploadImages = async (
  files: Express.Multer.File[],
  folder = "ecommerce",
) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
    });

    try {
      winstonLogger.info("File deleted:", file.path);
      await fs.unlink(file.path);
    } catch (err) {
      winstonLogger.warn("File already deleted or missing:", file.path);
    }
    return {
      url: result.secure_url,
      publicId: result.public_id,
      fileName: result.original_filename,
    };
  });

  return Promise.all(uploadPromises);
};

export const deleteImages = async (imagePublicId: string[]) => {
  return await Promise.all(
    imagePublicId.map((id: string) => {
      return cloudinary.uploader.destroy(id);
    }),
  );
};
