import { Response } from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import { AuthenticateRequest } from "../middleware/authMiddleware.ts";
import { createProductSchema, updateProductSchema } from "../validations/productValidation.ts";
import winstonLogger from "../utils/winstonLogger.ts";
import { prisma } from "../server.ts";
import { deleteImages, uploadImages } from "../utils/uploadImages.ts";

// create a product
const createProduct = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const { error, value } = createProductSchema.validate(req.body, { abortEarly: false });

    // validate request body
    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }

    const existingProduct = await prisma.product.findFirst({
        where: {
            name: value.name,
            brand: value.brand,
        },
    });


    if (existingProduct) {
        winstonLogger.warn("Duplicate product attempted", { name: value.name, brand: value.brand });
        return res.status(409).json({
            message: "A product with the same name and brand already exists.",
        });
    }
    // upload product images if available 
    const files = (req.files as Express.Multer.File[]) || [];

    const imageUrls = await uploadImages(files);
    // create the product in db 
    const product = await prisma.product.create({
        data: {
            ...value,
            images: {
                create: imageUrls.map(img => ({
                    url: img.url,
                    publicId: img.publicId,

                }))
            }
        }
    });
    winstonLogger.info("Product created successfully", { id: product.id, name: product.name });

    // Send response
    return res.status(201).json({
        message: "Product created successfully", data: {
            id: product.id,
            name: product.name,
        }
    });

});

// fetch all products - admin 
const getAllProductsAdmin = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const products = await prisma.product.findMany({
        include: {
            images: true
        }
    });
    return res.status(200).json({ data: products });
})


// get a single product
const getProduct = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const id = req.params.id;
    const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
    if (!product) {
        return res.status(404).json({ message: 'Product found' });
    }
    return res.status(200).json({ data: product });
})

// update a product (admin)
const updateProduct = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    // validated data 
    const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false });
    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }
    // find the product 
    const id = req.params.id;
    const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const { deletedImageIds = [], ...updateFields } = value;
    // Delet existing images
    // STEP 1: Delete Cloudinary images

    if (deletedImageIds.length > 0) {
        await deleteImages(deletedImageIds);
        // STEP 2: Delete image rows in DB
        await prisma.productImage.deleteMany({
            where: { publicId: { in: deletedImageIds } },
        });
    }


    // upload product images if available 
    const files = (req.files as Express.Multer.File[]) || [];
    const imageUrls = await uploadImages(files);

    // update the product 
    const updatedProduct = await prisma.product.update({
        where: { id }, include: { images: true }, data: {
            ...updateFields,
            images: {
                create: imageUrls.map(img => ({
                    url: img.url,
                    publicId: img.publicId,

                }))
            }
        }
    });

    return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
})

// delete a product (admin)
const deleteProduct = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const id = req.params.id;
    const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product) {
        // delete images from cloudinary 
        await deleteImages(product.images.map(img => img.publicId));
    }
    await prisma.product.delete({ where: { id } });
    return res.status(200).json({ message: 'Product deleted successfully' });
})

// fetch products with filter (client)


export {
    createProduct,
    getAllProductsAdmin,
    getProduct,
    updateProduct,
    deleteProduct
}