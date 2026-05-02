import { Label } from "@/components/ui/label";
import { inputClass, labelClass, selectLabelClass } from "../utils/className";
import {
  Controller,
  useFormContext,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CategoryDropdown from "./CategoryDropdown";
import Sizes from "./Sizes";
import { ProductFormType } from "@/schemas/productSchema";
import { ProductLookup } from "@/store/useProductStore";
import { Category, Variant } from "@/types/product.types";
import { Dispatch, SetStateAction } from "react";

interface ProductBasicInfoProps {
  productLookup: ProductLookup;
  categoryLevels: Category[][];
  handleCategoryChange: (levelIndex: number, value: string) => void;
  setRemovedVariants: Dispatch<SetStateAction<Record<string, Variant>>>;
  removedVariants: Record<string, Variant>;
  variantField: {
    appendVariant: UseFieldArrayAppend<ProductFormType>;
    removeVariant: UseFieldArrayRemove;
  };
}

function ProductBasicInfo({
  productLookup,
  categoryLevels,
  handleCategoryChange,
  setRemovedVariants,
  removedVariants,
  variantField,
}: ProductBasicInfoProps) {
  const { appendVariant, removeVariant } = variantField;
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<ProductFormType>();
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <div>
        <Label htmlFor="name" className={labelClass}>
          Product Name
        </Label>
        <div className="mt-2.5">
          <Input placeholder="Product Name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="brandId" className={selectLabelClass}>
          Brand Name
        </Label>
        <Controller
          control={control}
          name="brandId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>

              <SelectContent>
                {productLookup?.brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.brandId && (
          <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="Description" className="block text-sm/6 font-semibold ">
          Description
        </Label>
        <div className="mt-2.5">
          <Textarea
            id="description"
            rows={4}
            className={inputClass}
            placeholder="Description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="gender" className={selectLabelClass}>
          Gender
        </Label>
        <Controller
          control={control}
          name="genderId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>

              <SelectContent>
                {productLookup?.gender.map((gender) => (
                  <SelectItem key={gender.id} value={gender.id}>
                    {gender.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.genderId && (
          <p className="text-red-500 text-sm mt-1">{errors.genderId.message}</p>
        )}
      </div>
      <CategoryDropdown
        categoryLevels={categoryLevels}
        handleCategoryChange={handleCategoryChange}
      />
      <div>
        <Label htmlFor="featured" className={`${labelClass} mb-1`}>
          Feature Image
        </Label>
        <div className="mt-2.5 flex">
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <Sizes
        productLookup={productLookup}
        setRemovedVariants={setRemovedVariants}
        removedVariants={removedVariants}
        appendVariant={appendVariant}
        removeVariant={removeVariant}
      />
    </div>
  );
}

export default ProductBasicInfo;
