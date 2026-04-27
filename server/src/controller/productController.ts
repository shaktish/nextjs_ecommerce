import { Response } from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import { AuthenticateRequest } from "../middleware/authMiddleware.ts";
import { createProductSchema, productClientSchema, updateProductSchema } from "../validations/productValidation.ts";
import winstonLogger from "../utils/winstonLogger.ts";
import { prisma } from "../server.ts";
import { deleteImages, uploadImages } from "../utils/uploadImages.ts";
import { CreateVariantDTO } from "../types/productTypes.ts";
import { generateSku } from "../utils/product.utils.ts";
import { Prisma } from "../../generated/prisma/index";
import { updateProductPriceRange } from "../utils/productUtils.ts";



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

            const createdProduct = await tx.product.create({
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
                                        quantity: v.stock
                                    }
                                }
                            })
                        })
                    }
                }
            });
            await updateProductPriceRange(createdProduct.id, tx);
            return createdProduct;

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
            variants: {
                include: {
                    stock: true
                }
            },
        },
        orderBy: { updatedAt: 'desc' }
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
    const product = await prisma.product.findUnique({
        where: { id }, include: {
            images: true, variants: {
                include: {
                    stock: true
                }
            },
        }
    });
    const formatted = {
        ...product,
        variants: product?.variants.map(v => ({
            ...v,
            stock: v.stock?.quantity ?? 0
        }))
    };
    if (!product) {
        return res.status(404).json({ message: 'Product found' });
    }
    return res.status(200).json(formatted);
})

// update a product (admin)
const updateProduct = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    winstonLogger.info('update product controller init')
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

    if (req.body.deletedVariantIds) {
        try {
            req.body.deletedVariantIds = JSON.parse(req.body.deletedVariantIds);

        } catch (err) {
            winstonLogger.error('update product deletedVariantIds is invalid')
            return res.status(400).json({
                message: "Invalid JSON format for deletedVariantIds"
            });
        }
    }

    if (req.body.deletedImageIds) {
        try {
            req.body.deletedImageIds = JSON.parse(req.body.deletedImageIds);

        } catch (err) {
            winstonLogger.error('update product deletedImageIds is invalid')
            return res.status(400).json({
                message: "Invalid JSON format for deletedVariantIds"
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
    winstonLogger.info('deletedVariantIds -====>', { deletedVariantIds })
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
            const product = await tx.product.findUnique({
                where: { id }, include: {
                    brand: true,
                    gender: true,
                    category: true
                }
            });
            if (!product) {
                throw new Error("NOT_FOUND");
            }
            // get lookups
            const brand = value.brandId
                ? await tx.brand.findUnique({ where: { id: value.brandId } })
                : product!.brand;

            const gender = value.genderId
                ? await tx.gender.findUnique({ where: { id: value.genderId } })
                : product!.gender;

            const category = value.categoryId
                ? await tx.category.findUnique({ where: { id: value.categoryId } })
                : product!.category;

            // STEP 2: Delete image rows in DB
            if (deletedImageIds.length > 0) {
                await tx.productImage.deleteMany({
                    where: { publicId: { in: deletedImageIds }, productId: id },
                });
            }
            // Delete Removed variant
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
                    const size = sizeMap.get(variant.sizeId);

                    if (!existingIds.has(variant.id)) {
                        throw new Error("INVALID_VARIANT");
                    }
                    await tx.productVariant.update({
                        where: { id: variant.id },
                        data: {
                            price: variant.price,
                            sizeId: variant.sizeId,
                            sku: generateSku({ brand: brand!.slug, category: category!.slug, gender: gender!.slug, size: size!.slug, }),
                            stock: {
                                update: { quantity: variant.stock }
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
                                create: { quantity: v.stock }
                            }
                        };
                    });

                for (const v of newVariants) {
                    await tx.productVariant.create({ data: v });
                }
            }
            await updateProductPriceRange(product.id, tx);
            // update the product 
            return await tx.product.update({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    brand: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    gender: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    images: {
                        select: {
                            id: true,
                            url: true
                        }
                    },
                    variants: {
                        select: {
                            id: true,
                            price: true,
                            sku: true,
                            stock: {
                                select: {
                                    quantity: true
                                }
                            }
                        }
                    }
                },
                data: {
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
                    },
                    isFeatured: value.isFeatured !== undefined ? value.isFeatured : product.isFeatured,
                }
            });
        });

        // Delete existing cloudinary images
        if (deletedImageIds.length > 0) {
            await deleteImages(deletedImageIds);
        }
        return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
    } catch (e: any) {
        winstonLogger.error('Update product error', e)
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

    await prisma.$transaction([
        prisma.productVariant.deleteMany({ where: { productId: id } }),
        prisma.productImage.deleteMany({ where: { productId: id } }),
        prisma.product.delete({ where: { id } }),
    ]);

    try {
        await deleteImages(product.images.map(img => img.publicId));
    } catch (error) {
        winstonLogger.error('Cloudinary delete failed', {
            productId: id,
            images: product.images
        });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
})

// fetch products with filter (client)

const getProductsForClient = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const { error, value } = productClientSchema.validate(req.query, { abortEarly: false });

    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }


    const { page, limit, minPrice, maxPrice, sortBy, category } = value;
    const categories = value.categories
        ? value.categories.split(",").filter(Boolean)
        : [];

    const parent = await prisma.category.findUnique({
        where: { id: category },
        select: { id: true },
    });

    const scopeCategories = await prisma.category.findMany({
        where: {
            OR: [
                { id: { in: categories } },
                { parentId: parent?.id },
            ],
        },
        select: { id: true },
    });

    let finalCategoryIds: string[] = [];

    if (categories.length) {
        // user selected filters → map slugs to IDs
        const selected = await prisma.category.findMany({
            where: { id: { in: categories } },
            select: { id: true, slug: true },
        });

        finalCategoryIds = selected.map(c => c.id);
    } else {
        // no filters → use full scope
        finalCategoryIds = scopeCategories.map(c => c.id);
    }

    const sizes = value.sizes
        ? value.sizes.split(",").filter(Boolean)
        : [];

    const brands = value.brands
        ? value.brands.split(",").filter(Boolean)
        : [];

    const skip = (page - 1) * limit;

    const filters: Prisma.ProductWhereInput[] = [];

    if (finalCategoryIds.length) {
        filters.push({ categoryId: { in: finalCategoryIds } });
    }

    if (brands.length) {
        filters.push({ brandId: { in: brands } });
    }

    if (sizes.length || minPrice || maxPrice) {
        filters.push({
            variants: {
                some: {
                    ...(sizes.length && { sizeId: { in: sizes } }),
                    isActive: true,
                    price: {
                        gte: minPrice,
                        lte: maxPrice,
                    },
                },
            },
        });


    }
    const SORT_FIELD_MAP: Record<string, string> = {
        price: "minPrice",
        createdAt: "createdAt",
        rating: "rating",
    };

    const where = filters.length ? { AND: filters } : {};
    const [sortField, sortOrderRaw] = (sortBy || "createdAt-desc").split("-");
    const sortOrder = sortOrderRaw === "desc" ? "desc" : "asc";

    const sortByValue = SORT_FIELD_MAP[sortField] || "createdAt";

    winstonLogger.info(sortField, 'sortField');
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: sortField ? { [sortByValue]: sortOrder } : { updatedAt: "desc" },
            select: {
                id: true,
                name: true,
                brandId: true,
                categoryId: true,
                createdAt: true,
                images: {
                    select: {
                        id: true,
                        url: true,
                    }
                },
                minPrice: true,
                variants: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        sizeId: true,
                        price: true,
                        sku: true,
                        soldCount: true,

                        stock: {
                            select: {
                                quantity: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.product.count({ where })
    ]);

    res.status(200).json({
        data: products,
        totalProducts: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    });

})



const getCategoriesLookup = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const categories = await prisma.category.findMany({
        where: {
            isActive: true
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
    })

    return res.status(200).json(categories);
})


const getProductCategories = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const parentId = req.query.parentId ? req.query.parentId as string : null;

    const categories = await prisma.category.findMany({
        where: {
            isActive: true,
            parentId: parentId,
        },
        select: {
            id: true,
            name: true,
            parentId: true,
            isLeaf: true,
            level: true,
            isActive: true,
            imageUrl: true,
            slug: true,
        },
        orderBy: { name: 'asc' }
    })

    return res.status(200).json(categories);

})

const getProductLookups = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const [brands, gender, size] = await Promise.all([
        prisma.brand.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
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
        }),
        prisma.size.findMany({
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
        gender,
        size
    })
});


export {
    createProduct,
    getAllProductsAdmin,
    getProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getProductLookups,
    getProductCategories,
    getCategoriesLookup,
    getProductsForClient
}