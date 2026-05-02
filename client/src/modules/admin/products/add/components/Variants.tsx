import { ProductFormType } from "@/schemas/productSchema";
import { Label } from "@/components/ui/label";
import { labelClass } from "../utils/className";
import { Input } from "@/components/ui/input";
import { useFormContext, FieldArrayWithId } from "react-hook-form";

interface VariantsProps {
  sizeMap: Map<string, string>;
  variantFields: FieldArrayWithId<ProductFormType, "variants">[];
}

const Variants = ({ sizeMap, variantFields }: VariantsProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormType>();

  return (
    <div className="mt-2.5 ">
      {variantFields.map((variant, index) => {
        const sizeName = sizeMap.get(variant.sizeId);
        const showLabel = index === 0;
        return (
          <div key={variant.id} className="grid grid-cols-3 gap-4 mt-3">
            <input type="hidden" {...register(`variants.${index}.id`)} />
            <div>
              {showLabel && (
                <Label htmlFor="Price" className={`${labelClass} mb-1`}>
                  Size
                </Label>
              )}
              <input type="hidden" {...register(`variants.${index}.sizeId`)} />
              <p>{sizeName}</p>
            </div>

            <div>
              {showLabel && (
                <Label htmlFor="Price" className={`${labelClass} mb-1`}>
                  Price
                </Label>
              )}

              <Input
                type="number"
                {...register(`variants.${index}.price`, {
                  valueAsNumber: true,
                })}
                placeholder="Price"
              />
              {errors.variants?.[index]?.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.variants[index]?.price?.message}
                </p>
              )}
            </div>
            <div>
              {showLabel && (
                <Label htmlFor="Stock" className={`${labelClass} mb-1`}>
                  Stock
                </Label>
              )}

              <Input
                type="number"
                {...register(`variants.${index}.stock`, {
                  valueAsNumber: true,
                })}
                placeholder="Stock"
              />
              {errors.variants?.[index]?.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.variants[index]?.stock?.message}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Variants;
