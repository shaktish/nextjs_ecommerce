import cloudinary from "../config/cloudinary";
import fsPromises from "fs/promises";
import fs from "fs";

import winstonLogger from "./winstonLogger";

export const uploadImages = async (
  files: Express.Multer.File[],
  folder = "ecommerce",
) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    winstonLogger.info(`Uploading: ${file.path}`);
    winstonLogger.info(`Exists: ${fs.existsSync(file.path)}`);
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
    });

    try {
      await fsPromises.unlink(file.path);
      winstonLogger.info("File deleted:", file.path);
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
