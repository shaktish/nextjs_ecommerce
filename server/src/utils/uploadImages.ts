import cloudinary from "../config/cloudinary.ts";
import fs from "fs/promises";
import { ProductImage } from "../types/productTypes.ts";


export const uploadImages = async (files: Express.Multer.File[]) => {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map(async (file) => {
        console.log("Files:", files.map(f => f.path));

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "ecommerce"
        })

        try {
            console.log("File deleted:", file.path);
            await fs.unlink(file.path);
        } catch (err) {
            console.warn("File already deleted or missing:", file.path);
        }
        return { url: result.secure_url, publicId: result.public_id };
    })

    return Promise.all(uploadPromises);
}

export const deleteImages = async (imagePublicId: string[]) => {
    return await Promise.all(
        imagePublicId.map((id: string) => {
            return cloudinary.uploader.destroy(id);
        })
    );
}