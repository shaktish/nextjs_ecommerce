import { Response } from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import { AuthenticateRequest } from "../middleware/authMiddleware.ts";
import { createProductSchema, updateProductSchema } from "../validations/productValidation.ts";
import winstonLogger from "../utils/winstonLogger.ts";
import { prisma } from "../server.ts";
import { deleteImages, uploadImages } from "../utils/uploadImages.ts";
import { CreateVariantDTO } from "../types/productTypes.ts";
import { generateSku } from "../utils/product.utils.ts";


// create a product
const createProduct = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    if (req.body.variants) {
        try {
            req.body.variants = JSON.parse(req.body.variants);
        } catch (err) {
            return res.status(400).json({
                message: "Invalid JSON format for variants"
            });
        }
    }

    const { error, value } = createProductSchema.validate(req.body, { abortEarly: false });
    // validate request body
    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }

    // upload product images if available 
    const files = (req.files as Express.Multer.File[]) || [];
    let uploadedImages: { url: string; publicId: string }[] = [];


    try {

        // 3️⃣ Upload images first
        uploadedImages = await uploadImages(files);

        const [brand, gender, category] = await Promise.all([
            prisma.brand.findUnique({ where: { id: value.brandId } }),
            prisma.gender.findUnique({ where: { id: value.genderId } }),
            prisma.category.findUnique({ where: { id: value.categoryId } })
        ]);

        if (!brand || !gender || !category) {
            return res.status(400).json({
                message: "Invalid brand, gender or category"
            });
        }

        const sizeIds = value.variants.map((v: CreateVariantDTO) => v.sizeId);
        const sizes = await prisma.size.findMany({
            where: { id: { in: sizeIds } }
        });
        const sizeMap = new Map(sizes.map(s => [s.id, s]));

        // 4️⃣ Run DB transaction
        const product = await prisma.$transaction(async (tx) => {
            // tx - transactionClient

            return await tx.product.create({
                data: {
                    name: value.name,
                    description: value.description,
                    brandId: value.brandId,
                    categoryId: value.categoryId,
                    genderId: value.genderId,
                    images: {
                        create: uploadedImages.map(img => ({
                            url: img.url,
                            publicId: img.publicId
                        }))
                    },

                    variants: {
                        create: value.variants.map((v: CreateVariantDTO) => {
                            const size = sizeMap.get(v.sizeId);
                            return ({
                                sizeId: v.sizeId,
                                sku: generateSku({ brand: brand!.slug, gender: gender!.slug, category: category!.slug, size: size!.slug }),
                                price: v.price,
                                stock: {
                                    create: {
                                        quantity: v.stock.quantity
                                    }
                                }
                            })
                        })
                    }
                }
            });

        });

        return res.status(201).json({
            message: "Product created successfully",
            data: { id: product.id }
        });

    } catch (err: any) {
        const prismaError = err as { code?: string };

        winstonLogger.warn("err", err);
        // VERY IMPORTANT — rollback Cloudinary images
        if (uploadedImages.length > 0) {
            await deleteImages(uploadedImages.map((item) => item.publicId));
        }

        if (prismaError.code === "P2003") {
            return res.status(400).json({
                message: "Invalid foreign key reference."
            });
        }
        return res.status(500).json({
            message: "Something went wrong"
        });
    }

});

// fetch all products - admin 
const getAllProductsAdmin = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const products = await prisma.product.findMany({
        include: {
            images: true,
            variants: true,
        }
    });
    return res.status(200).json({ data: products });
})

const getFeaturedProducts = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const products = await prisma.product.findMany({
        where: {
            isFeatured: true
        },
        include: {
            images: true
        }
    });
    return res.status(200).json({ data: products });
})

// get a single product
const getProduct = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const id = req.params.id;
    const product = await prisma.product.findUnique({ where: { id }, include: { images: true, variants: true } });
    if (!product) {
        return res.status(404).json({ message: 'Product found' });
    }
    return res.status(200).json({ data: product });
})

// update a product (admin)
const updateProduct = asyncHandler(async (req: AuthenticateRequest, res: Response) => {

    if (req.body.variants) {
        try {
            req.body.variants = JSON.parse(req.body.variants);
        } catch (err) {
            winstonLogger.error('update product variants is empty')
            return res.status(400).json({
                message: "Invalid JSON format for variants"
            });
        }
    }

    // validated data 
    const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false });

    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }
    const id = req.params.id;
    const files = (req.files as Express.Multer.File[]) || [];
    if (!Object.keys(req.body).length && files.length === 0) {
        return res.status(400).json({
            message: "At least one field or image must be provided"
        });
    }
    let uploadedImages: { url: string; publicId: string }[] = [];
    const { deletedImageIds = [], deletedVariantIds = [], variants = [] } = value;

    try {
        // upload product images if available 
        uploadedImages = await uploadImages(files);

        const sizeIds = (value.variants || []).map((v: CreateVariantDTO) => v.sizeId);
        const sizes = await prisma.size.findMany({
            where: { id: { in: sizeIds } }
        });
        const sizeMap = new Map(sizes.map(s => [s.id, s]));


        // transaction 
        const updatedProduct = await prisma.$transaction(async (tx) => {
            // find the product 
            const product = await tx.product.findUnique({ where: { id } });
            if (!product) {
                throw new Error("NOT_FOUND");
            }
            // get lookups
            let brand = null
            let gender = null
            let category = null

            if (value.brandId && value.genderId && value.categoryId) {
                [brand, gender, category] = await Promise.all([
                    prisma.brand.findUnique({ where: { id: value.brandId } }),
                    prisma.gender.findUnique({ where: { id: value.genderId } }),
                    prisma.category.findUnique({ where: { id: value.categoryId } })
                ]);
            }

            // STEP 2: Delete image rows in DB
            if (deletedImageIds.length > 0) {
                await tx.productImage.deleteMany({
                    where: { publicId: { in: deletedImageIds }, productId: id },
                });
            }

            // Delete Removed variants
            await tx.productVariant.deleteMany({
                where: { id: { in: deletedVariantIds }, productId: id }
            });
            if (sizeIds) {
                // Update existing variants
                const existingVariants = await tx.productVariant.findMany({
                    where: { productId: id },
                    select: { id: true }
                });
                const existingIds = new Set(existingVariants.map(v => v.id));

                for (const variant of variants.filter((v: { id: string }) => v.id)) {
                    if (!existingIds.has(variant.id)) {
                        throw new Error("INVALID_VARIANT");
                    }

                    await tx.productVariant.update({
                        where: { id: variant.id },
                        data: {
                            price: variant.price,
                            sku: variant.sku,
                            stock: {
                                update: { quantity: variant.stock.quantity }
                            }
                        }
                    });
                }

                // Create new variants
                const newVariants = variants
                    .filter((v: { id: string }) => !v.id)
                    .map(v => {
                        const size = sizeMap.get(v.sizeId);
                        if (!size) throw new Error("INVALID_SIZE");
                        return {
                            productId: id,
                            sizeId: size.id,
                            sku: generateSku({
                                brand: brand!.slug,
                                gender: gender!.slug,
                                category: category!.slug,
                                size: size.slug
                            }),
                            price: v.price,
                            stock: {
                                create: { quantity: v.stock.quantity }
                            }
                        };
                    });

                for (const v of newVariants) {
                    await tx.productVariant.create({ data: v });
                }
            }

            // update the product 
            return await tx.product.update({
                where: { id }, include: { images: true }, data: {
                    ...(value.name && { name: value.name }),
                    ...(value.description && { description: value.description }),
                    ...(value.brandId && { brandId: value.brandId }),
                    ...(value.genderId && { genderId: value.genderId }),
                    ...(value.categoryId && { categoryId: value.categoryId }),
                    images: {
                        create: uploadedImages.map(img => ({
                            url: img.url,
                            publicId: img.publicId
                        }))
                    }
                }
            });
        });

        // Delete existing images
        // - Delete Cloudinary images
        if (deletedImageIds.length > 0) {
            await deleteImages(deletedImageIds);
        }
        return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
    } catch (e: any) {
        winstonLogger.error('Updaete product error', e)
        // Rollback newly uploaded images
        if (uploadedImages.length > 0) {
            await deleteImages(uploadedImages.map(i => i.publicId));
        }

        if (e.message === "NOT_FOUND") {
            return res.status(404).json({ message: "Product not found" });
        }

        if (e?.code === "P2002") {
            return res.status(409).json({
                message: "Duplicate SKU or duplicate gender-size combination."
            });
        }

        return res.status(500).json({
            message: "Something went wrong"
        });
    }

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

export const getProductLookups = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const [brands, categories, genders] = await Promise.all([
        prisma.brand.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
            },
            orderBy: { name: 'asc' }
        }),
        prisma.category.findMany({
            where: {
                isActive: true,
                // parent: null
            },
            select: {
                id: true,
                name: true,
                parentId: true,
                isLeaf: true,
                level: true,
                isActive: true,
            },
            orderBy: { name: 'asc' }
        }),
        prisma.gender.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: { name: "asc" }

        })
    ]);

    return res.status(200).json({
        brands,
        categories,
        genders
    })
});


export {
    createProduct,
    getAllProductsAdmin,
    getProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts
}