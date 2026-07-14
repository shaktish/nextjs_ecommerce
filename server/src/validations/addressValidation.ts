import Joi from "joi";

export const addressSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
  phone: Joi.string().required(),
  isDefault: Joi.boolean().optional(),
});
