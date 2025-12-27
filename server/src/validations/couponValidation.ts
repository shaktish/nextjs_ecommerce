import Joi from "joi";

export const createCouponSchema = Joi.object({
    code: Joi.string().trim().required().min(2).max(100),
    discountPercentage: Joi.number().positive().precision(2).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    usageLimit: Joi.number().integer().min(0).required(),
})