import { Label } from "@/components/ui/label";
import { selectLabelClass } from "../utils/className";
import { Button } from "@/components/ui/button";
import {
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { ProductFormType } from "@/schemas/productSchema";
import { Variant } from "@/types/product.types";
import { ProductLookup } from "@/store/useProductStore";
import { Dispatch, SetStateAction } from "react";

interface SizesProps {
  productLookup: ProductLookup;
  setRemovedVariants: Dispatch<SetStateAction<Record<string, Variant>>>;
  removedVariants: Record<string, Variant>;
  appendVariant: UseFieldArrayAppend<ProductFormType, "variants">;
  removeVariant: UseFieldArrayRemove;
}

function Sizes({
  productLookup,
  setRemovedVariants,
  removedVariants,
  appendVariant,
  removeVariant,
}: SizesProps) {
  const {
    formState: { errors },
    control,
  } = useFormContext<ProductFormType>();

  const variants = useWatch({
    control,
    name: "variants",
  }) as Variant[];

  const toggleSize = (sizeId: string) => {
    const variantIndex = variants.findIndex((v) => v.sizeId === sizeId);
    if (variantIndex !== -1) {
      // if variantIndex found, remove it
      const removedVariant = variants[variantIndex];
      // store the removed variant
      setRemovedVariants((prev) => ({
        ...prev,
        [sizeId]: removedVariant,
      }));

      removeVariant(variantIndex);
    } else {
      const cachedVariant = removedVariants[sizeId];
      if (cachedVariant) {
        // restore original variant (keeps DB id)
        appendVariant(cachedVariant);
        setRemovedVariants((prev) => {
          const copy = { ...prev };
          delete copy[sizeId];
          return copy;
        });
      } else {
        // new variant
        appendVariant({
          id: null,
          sizeId,
          price: 0,
          stock: 0,
        });
      }
    }
  };
  return (
    <div>
      <Label className={selectLabelClass}>Sizes</Label>

      <div className="mt-1.5 flex flex-wrap gap-2">
        {productLookup?.size.map((sizeItem) => {
          const isSelected = variants.some((v) => v.sizeId === sizeItem.id);
          return (
            <Button
              type="button"
              key={sizeItem.id}
              size="sm"
              onClick={() => toggleSize(sizeItem.id)}
              className={`border border-2 ${
                isSelected ? "border-[#FB923C]" : ""
              }`}
            >
              {sizeItem.name}
            </Button>
          );
        })}
      </div>
      {errors.variants?.message && (
        <p className="text-red-500 text-sm mt-1">{errors.variants.message}</p>
      )}
    </div>
  );
}

export default Sizes;
