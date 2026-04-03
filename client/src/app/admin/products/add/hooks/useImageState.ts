import { ProductFormType } from "@/schemas/productSchema";
import { ProductImage } from "@/store/useProductStore";
import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

const useImageState = (setValue: UseFormSetValue<ProductFormType>) => {
    const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);


    const [existingImagePreviews, setExistingImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<
        ProductImage[]
    >([]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const files = Array.from(event.target.files);
        setSelectedImageFiles((prev) => {
            const updated = [...prev, ...files];
            setValue("images", updated, { shouldValidate: true });
            return updated;
        });
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        event.target.value = "";
    };

    const removeImage = (index: number) => {
        setSelectedImageFiles((prev) => {
            const updated = prev.filter((_, idx) => idx !== index);
            setValue("images", updated, { shouldValidate: true });
            return updated;
        });
        setImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
    };
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);
    return {
        selectedImageFiles,
        existingImagePreviews,
        existingImages,
        imagePreviews,
        handleFileChange,
        removeImage,
        removeExistingImage,
        setExistingImages,
        setExistingImagePreviews
    }

}

export default useImageState;