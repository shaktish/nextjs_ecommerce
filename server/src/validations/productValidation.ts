import Joi from "joi";

export const createProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    brand: Joi.string().trim().min(1).max(50).required(),
    description: Joi.string().trim().min(5).max(500).required(),
    category: Joi.string().trim().required(),
    gender: Joi.string().lowercase()
        .valid("male", "female", "unisex").required(),

    sizes: Joi.array().items(Joi.string().trim()).min(1).required(),
    colors: Joi.array().items(Joi.string().trim()).min(1).required(),

    price: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().min(0).required(),

    images: Joi.array().items(Joi.string().uri().trim()).min(1).optional()
        .messages({
            "array.min": "At least one image URL is required if images are provided.",
        }),

    isFeatured: Joi.boolean().default(false),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    brand: Joi.string().trim().min(1).max(50),
    description: Joi.string().trim().min(5).max(500),
    category: Joi.string().trim(),
    gender: Joi.string().lowercase().valid("male", "female", "unisex"),

    sizes: Joi.array().items(Joi.string().trim()).min(1),
    colors: Joi.array().items(Joi.string().trim()).min(1),

    price: Joi.number().positive().precision(2),
    stock: Joi.number().integer().min(0),

    images: Joi.array().items(Joi.string().uri().trim())
        .messages({
            "array.min": "At least one image URL is required if images are provided."
        }),
    deletedImageIds: Joi.array().items(Joi.string().trim()),
    isFeatured: Joi.boolean(),
}).min(1);  