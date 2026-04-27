import Joi from "joi";


const variantSchema = Joi.object({
    id: Joi.string().optional(),
    sizeId: Joi.string().required(),
    price: Joi.number().integer().min(0).required(),
    stock: Joi.number().integer().min(0).required(),
});

export const createProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    brandId: Joi.string().required(),
    description: Joi.string().trim().min(5).max(500).required(),
    genderId: Joi.string().required(),
    categoryId: Joi.string().required(),
    variants: Joi.array()
        .items(variantSchema)
        .min(1)
        .required(),
    images: Joi.array().items(Joi.string().uri().trim()).min(1).optional()
        .messages({
            "array.min": "At least one image URL is required if images are provided.",
        }),
    isFeatured: Joi.boolean().default(false),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    brandId: Joi.string().optional(),
    description: Joi.string().trim().min(5).max(500).optional(),
    categoryId: Joi.string().optional(),
    genderId: Joi.string().optional(),
    variants: Joi.array()
        .items(variantSchema)
        .min(1)
        .optional(),
    images: Joi.array().items(Joi.string().uri().trim()).min(1).optional()
        .messages({
            "array.min": "At least one image URL is required if images are provided.",
        }),
    deletedImageIds: Joi.array().items(Joi.string().trim()).optional(),
    deletedVariantIds: Joi.array().items(Joi.string().trim()).optional(),
    isFeatured: Joi.boolean().optional(),
})

export const productClientSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(10),
    category: Joi.string().required(),
    categories: Joi.string().optional(),
    brands: Joi.string().optional(),
    sizes: Joi.string().optional(),
    minPrice: Joi.number().min(0)
        .default(0),
    maxPrice: Joi.number().min(0).default(10000)
        .greater(Joi.ref("minPrice")),
    sortBy: Joi.string()
        .valid(
            "createdAt-desc",
            "createdAt-asc",
            "price-asc",
            "price-desc"
        )
        .optional(),

});