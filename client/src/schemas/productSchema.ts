import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(3, "Product name required"),
    description: z.string().min(5, "Description required"),
    brandId: z.string().min(1, "Brand required"),
    genderId: z.string().min(1, "Gender required"),
    featured: z.boolean().optional(),
    variants: z.array(
        z.object({
            id: z.string().optional(),
            sizeId: z.string(),
            price: z.number().min(1, 'Enter a value'),
            stock: z.number().min(1, 'Enter a value'),
        })

    ).min(1, "Please select at least one size"),
    categories: z
        .array(z.string().optional())
        .superRefine((arr, ctx) => {
            arr.forEach((value, index) => {
                if (!value) {
                    ctx.addIssue({
                        code: "custom",
                        message:
                            index === 0
                                ? "Please select a category"
                                : "Please select a subcategory",
                        path: [index],
                    });
                }
            });
        }),
    images: z
        .array(z.instanceof(File)).optional()//.min(1, "Please upload at least one image")

});

export type ProductFormType = z.infer<typeof productSchema>;