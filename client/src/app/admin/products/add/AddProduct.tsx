"use client";
import { FormProvider, useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import useImageState from "../../../../modules/admin/products/add/hooks/useImageState";
import { useForm, useWatch } from "react-hook-form";
import { ProductFormType, productSchema } from "@/schemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSubmitFormData } from "../../../../modules/admin/products/add/utils/buildProductFormData";
import { mapProductToForm } from "../../../../modules/admin/products/add/utils/utils";
import {
  Category,
  Product,
  ProductLookup,
  Variant,
} from "@/types/product.types";
import ImageUpload from "../../../../modules/admin/products/add/components/ImageUpload";
import Variants from "../../../../modules/admin/products/add/components/Variants";
import ProductBasicInfo from "../../../../modules/admin/products/add/components/ProductBasicInfo";
import addProduct from "@/modules/admin/products/api/addProduct";
import updateProduct from "@/modules/admin/products/api/updateProduct";

interface ProductFormProps {
  productLookup: ProductLookup;
  categoriesLookup: Category[];
  product?: Product<Variant>;
  editProductId?: string | undefined;
}

const AddProductForm = ({
  productLookup,
  categoriesLookup,
  product,
  editProductId,
}: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const defaultValues = useMemo(
    () =>
      product
        ? mapProductToForm(product, categoriesLookup)
        : {
            name: "",
            description: "",
            brandId: "",
            genderId: "",
            featured: false,
            variants: [],
            categories: [],
            images: [],
          },
    [product, categoriesLookup],
  );

  const methods = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
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
    // edit view product
    if (!product) return;

    const imageUrls = product.images.map((image) => image.url);

    setExistingImagePreviews(imageUrls);
    setExistingImages(product.images);
  }, [product, setExistingImages, setExistingImagePreviews]);

  const submitButton = product ? "Update Product" : "Create Product";
  const submitButtonLoading = product
    ? "Updating Product..."
    : "Creating Product...";

  const onSubmit = async (data: ProductFormType) => {
    if (isLoading) return;
    setIsLoading(true);

    const categoryId = data.categories.at(-1);
    const removedVariantsWithId = Object.entries(removedVariants).reduce(
      (acc, [key, variant]) => {
        if (variant.id) {
          acc[key] = variant;
        }
        return acc;
      },
      {} as Record<string, Variant>,
    );

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
      isEditMode: !!product,
      existingImagesData: existingImages,
      existingPreviews: existingImagePreviews,
      removedVariants: removedVariantsWithId,
    });
    try {
      if (product && editProductId) {
        await updateProduct(editProductId, formData);
      } else {
        await addProduct(formData);
      }
      router.push("/admin/products/list");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
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
            {product ? "Edit" : "Add"} Product
          </h1>
        </header>
      </div>
      <FormProvider {...methods}>
        <form
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

export default AddProductForm;
