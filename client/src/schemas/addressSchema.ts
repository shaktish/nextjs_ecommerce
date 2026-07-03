import { z } from "zod";

export const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal Code is required"),
  address: z.string().min(4, "Address is required"),
  isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
