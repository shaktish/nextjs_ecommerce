import { z } from "zod";
// not used yet
export const couponSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    discountPercentage: z
      .number()
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount cannot exceed 100%"),
    startDate: z.date(),
    endDate: z.date(),
    usageLimit: z.number().min(1, "Usage limit is required"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CouponFormData = z.infer<typeof couponSchema>;
