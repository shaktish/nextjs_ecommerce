"use client";

import { Slider } from "@/components/ui/slider";
import { ProductLookup } from "@/store/useProductStore";
import { Category } from "@/types/product.types";
import { formatPrice } from "@/utils/number";

export interface FilterSectionProps {
  categories: string[];
  brands: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
  productCategories: {
    [parentId: string]: Category[];
  } | null;
  productLookup: ProductLookup | null;
  updateFilter: (key: string, value: string, isMulti?: boolean) => void;
  updatePriceFilter: (prices: number[]) => void;
  category: string;
  maxPriceDefault: number;
}

export const FilterSection = ({
  categories,
  brands,
  sizes,
  minPrice,
  maxPrice,
  productCategories,
  productLookup,
  updateFilter,
  updatePriceFilter,
  category,
  maxPriceDefault,
}: FilterSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="mb-3">
        <h3 className="mb-3 font-semibold">Categories</h3>
        {productCategories?.[category]?.map((category: Category) => {
          return (
            <label className="flex items-center gap-2" key={category.id}>
              <input
                type="checkbox"
                checked={categories.includes(category.id)}
                onChange={() => updateFilter("categories", category.id)}
              />
              {category.name}
            </label>
          );
        })}
      </div>
      <div className="mb-3">
        <h3 className="mb-3 font-semibold">Brand</h3>
        {productLookup?.brands.map((brand: any) => {
          return (
            <label className="flex items-center gap-2" key={brand.id}>
              <input
                type="checkbox"
                checked={brands.includes(brand.id)}
                onChange={() => updateFilter("brands", brand.id)}
              />

              {brand.name}
            </label>
          );
        })}
      </div>
      <div className="mb-3">
        <h3 className="mb-3 font-semibold">Price range</h3>

        <Slider
          defaultValue={[minPrice, maxPrice]}
          max={maxPriceDefault}
          minStepsBetweenThumbs={1}
          step={100}
          className="mx-auto w-full"
          onValueCommit={(value) => {
            updatePriceFilter(value as number[]);
          }}
        />
        <div className="flex justify-between  mt-2 text-sm w-full">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>
      <div className="mb-3">
        <h3 className="mb-3 font-semibold">Sizes</h3>
        {productLookup?.size.map((size: any) => {
          return (
            <label className="flex items-center gap-2" key={size.id}>
              <input
                type="checkbox"
                checked={sizes.includes(size.id)}
                onChange={() => updateFilter("sizes", size.id)}
              />

              {size.name}
            </label>
          );
        })}
      </div>
    </div>
  );
};
