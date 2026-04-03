import { ProductImage } from "@/store/useProductStore";
import { Variant } from "@/types/product.types";

type BuildFormDataParams = {
    formState: any;
    variants: Variant[];
    selectedFiles: File[];
    isEditMode: boolean;
    existingImagesData: ProductImage[];
    existingPreviews: string[];
    removedVariants: Record<string, Variant>;
};

export const buildSubmitFormData = ({
    formState,
    variants,
    selectedFiles,
    isEditMode,
    existingImagesData,
    existingPreviews,
    removedVariants
}: BuildFormDataParams) => {

    const formData = new FormData();
    // remove empty value id for new variants
    const updatedVariants = variants.map((item) => {
        return item.id && item.id.trim() !== ""
            ? item
            : {
                sizeId: item.sizeId,
                price: item.price,
                stock: item.stock,
            };
    });

    // text fields
    formData.append("name", formState.name);
    formData.append("brandId", formState.brandId);
    formData.append("description", formState.description);
    formData.append("categoryId", formState.categoryId);
    formData.append("genderId", formState.genderId);
    formData.append(
        "variants",
        JSON.stringify(updatedVariants),
    );
    formData.append("isFeatured", String(formState.featured));

    selectedFiles.forEach((file) => {
        formData.append("images", file as Blob);
    });

    if (isEditMode) {
        if (existingImagesData.length !== existingPreviews.length) {
            const deletedImages = existingImagesData.filter(
                (item) => !existingPreviews.includes(item.url),
            );
            formData.append(
                "deletedImageIds",
                deletedImages.map((item) => item.publicId).join(","),
            );
        }

        formData.append(
            "deletedVariantIds",
            JSON.stringify(Object.values(removedVariants).map((item) => item.id)),
        );
    }
    return formData;
};