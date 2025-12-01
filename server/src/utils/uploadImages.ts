import cloudinary from "../config/cloudinary.ts";
import fs from "fs/promises";


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
        return result.secure_url;
    })

    return Promise.all(uploadPromises);
}