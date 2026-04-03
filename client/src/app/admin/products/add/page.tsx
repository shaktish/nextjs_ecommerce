"use client";
import { FormProvider, useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/useProductStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import useImageState from "./hooks/useImageState";
import { useForm, useWatch } from "react-hook-form";
import { ProductFormType, productSchema } from "@/schemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSubmitFormData } from "./utils/buildProductFormData";
import { mapProductToForm } from "./utils/utils";
import { Variant } from "@/types/product.types";
import ImageUpload from "./components/ImageUpload";
import Variants from "./components/Variants";
import ProductBasicInfo from "./components/ProductBasicInfo";

const AddProductAdmin = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    addProduct,
    getProduct,
    isLoading,
    error,
    updateProduct,
    productLookup,
    getLookup,
    getCategoriesLookup,
    categoriesLookup,
  } = useProductStore();

  const methods = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      brandId: "",
      genderId: "",
      featured: false,
      variants: [],
      categories: [],
      images: [],
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = methods;
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const [removedVariants, setRemovedVariants] = useState<
    Record<string, Variant>
  >({});

  const sizeMap = useMemo(() => {
    const sizeLookup = productLookup?.size;
    const map = new Map<string, string>();
    if (sizeLookup) {
      for (let item of sizeLookup) {
        map.set(item.id, item.name);
      }
    }
    return map;
  }, [productLookup?.size]);

  const editedProductId = searchParams.get("id");
  const isEditMode = !!editedProductId;
  const selectedCategories = useWatch({ control, name: "categories" }) || [];

  const categoryLevels = useMemo(() => {
    const levels = [];
    let parentId: string | null = null;
    while (parentId !== undefined) {
      const level = categoriesLookup.filter((c) => c.parentId === parentId);
      if (!level.length) break;
      levels.push(level);
      parentId = selectedCategories[levels.length - 1] || null;
      if (!parentId) break;
    }
    return levels;
  }, [categoriesLookup, selectedCategories]);

  const {
    selectedImageFiles,
    imagePreviews,
    handleFileChange,
    removeImage,

    // from server
    existingImages,
    setExistingImages,
    existingImagePreviews,
    removeExistingImage,
    setExistingImagePreviews,
  } = useImageState(setValue);

  useEffect(() => {
    getLookup();
    getCategoriesLookup();
  }, []);

  useEffect(() => {
    // Edit Product
    const fetchProduct = async () => {
      if (!isEditMode || !editedProductId || !categoriesLookup.length) return;
      const data = await getProduct(editedProductId);
      if (data) {
        const imageUrls = data?.images.map((image) => image.url);
        setExistingImagePreviews(imageUrls);
        setExistingImages(data.images);
        reset(mapProductToForm(data, categoriesLookup));
      }
    };

    fetchProduct();
  }, [isEditMode, editedProductId, categoriesLookup]);

  useEffect(() => {
    if (error) {
      const details = Array.isArray(error.details) ? error.details : [];
      const message =
        details.length > 0
          ? details.map((item, idx) => <div key={idx}>{item}</div>)
          : error.message || "Something went wrong";

      toast.error(message);
    }
  }, [error]);

  const submitButton = isEditMode ? "Update Product" : "Create Product";
  const submitButtonLoading = isEditMode
    ? "Updating Product..."
    : "Creating Product...";

  const onSubmit = async (data: ProductFormType) => {
    let response;
    const categoryId = data.categories.at(-1);
    const formData = buildSubmitFormData({
      formState: {
        name: data.name,
        brandId: data.brandId,
        description: data.description,
        categoryId: categoryId,
        genderId: data.genderId,
        featured: String(data.featured),
      },
      variants: data.variants,
      selectedFiles: selectedImageFiles,
      isEditMode,
      existingImagesData: existingImages,
      existingPreviews: existingImagePreviews,
      removedVariants,
    });
    if (isEditMode) {
      response = await updateProduct(editedProductId, formData);
    } else {
      response = await addProduct(formData);
    }

    if (response) {
      router.push("/admin/products/list");
    }
  };

  const handleCategoryChange = (levelIndex: number, value: string) => {
    const updated = [...selectedCategories];
    updated[levelIndex] = value;

    updated.splice(levelIndex + 1);
    setValue("categories", updated, { shouldValidate: true });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-center mb-2 text-center">
          <h1 className="text-1xl font-semibold">
            {isEditMode ? "Edit" : "Add"} Product
          </h1>
        </header>
      </div>
      <FormProvider {...methods}>
        <form
          action="#"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
          className={isLoading ? "pointer-events-none opacity-70" : ""}
        >
          <ImageUpload
            errors={errors}
            handleFileChange={handleFileChange}
            imagePreviews={imagePreviews}
            removeImage={removeImage}
            removeExistingImage={removeExistingImage}
            existingImagePreviews={existingImagePreviews}
          />
          <ProductBasicInfo
            categoryLevels={categoryLevels}
            handleCategoryChange={handleCategoryChange}
            productLookup={productLookup}
            removedVariants={removedVariants}
            setRemovedVariants={setRemovedVariants}
            variantField={{
              appendVariant,
              removeVariant,
            }}
          />
          <Variants sizeMap={sizeMap} variantFields={variantFields} />
          <div>
            <Button
              className="mt-4.5 w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              {isLoading ? submitButtonLoading : submitButton}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddProductAdmin;
