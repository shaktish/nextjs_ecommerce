import Joi from 'joi';

export const addressSchema = Joi.object({
    id: Joi.string().optional(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required()
});

export const updateAddressSchema = addressSchema.keys({
    id: Joi.string().required()
});