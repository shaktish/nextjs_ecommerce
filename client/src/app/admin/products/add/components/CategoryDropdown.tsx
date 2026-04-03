import { Category } from "@/types/product.types";
import { Label } from "@/components/ui/label";
import { selectInputClass, selectLabelClass } from "../utils/className";
import {
  Control,
  Controller,
  FieldErrors,
  useFormContext,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormType } from "@/schemas/productSchema";
interface CategoryDropdownProps {
  categoryLevels: Category[][];
  handleCategoryChange: (levelIndex: number, value: string) => void;
}
const CategoryDropdown = ({
  categoryLevels,
  handleCategoryChange,
}: CategoryDropdownProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormType>();
  return (
    <div>
      {categoryLevels.map((levelOptions, levelIndex) => (
        <div key={levelIndex}>
          <Label className={selectLabelClass}>
            {levelIndex === 0 ? "Select Category" : "Select Subcategory"}
          </Label>

          <Controller
            name={`categories.${levelIndex}`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCategoryChange(levelIndex, value);
                }}
              >
                <SelectTrigger className={selectInputClass}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {levelOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categories?.[levelIndex] && (
            <p className="text-red-500 text-sm mt-1">
              {errors.categories[levelIndex]?.message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryDropdown;
