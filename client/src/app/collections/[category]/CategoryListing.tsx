"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/store/useProductStore";
import { useParams } from "next/navigation";

import { Loader2, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import {
  buildQueryParams,
  updatePageParam,
} from "../../../modules/collections/utils/queryParams";
import { FilterSection } from "@/modules/collections/components/Filters";
import { Pagination } from "@/modules/collections/components/Pagination";
import { ProductGrid } from "@/modules/collections/components/ProductGrid";
import { formatCategoryName } from "@/modules/collections/utils/formatCategoryName";
import { sortByOptions } from "@/modules/collections/constants/constants";
import {
  ProductCategories,
  ProductLookup,
  VariantForTable,
} from "@/types/product.types";
import { useTransition } from "react";

interface CategoryListing {
  products: Product<VariantForTable>[];
  productCategories: ProductCategories | null;
  productLookup: ProductLookup;
  totalPages: number;
}

function CategoryListing({
  products,
  productCategories,
  productLookup,
  totalPages,
}: CategoryListing) {
  const [isPending, startTransition] = useTransition();

  const minPriceDefault = 0;
  const maxPriceDefault = 10000;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  // parent category
  const category = params.category as string;
  // // url params for filters
  const categoryParam = searchParams.get("categories") || "";
  const brandsParam = searchParams.get("brands") || "";
  const sizesParam = searchParams.get("sizes") || "";
  const sortByParam = searchParams.get("sortBy") || sortByOptions[0].value;
  const minPriceParam = Number(searchParams.get("minPrice")) || minPriceDefault;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || maxPriceDefault;
  const currentPageParam = Number(searchParams.get("page")) || 1;

  const updateRoute = (params: URLSearchParams) => {
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const updateFilter = (key: string, value: string, isMulti = true) => {
    const params = buildQueryParams(searchParams, key, value, isMulti);
    updateRoute(params);
  };

  const nextPageHandler = () => {
    const params = updatePageParam(searchParams, currentPageParam + 1);
    updateRoute(params);
  };

  const updatePriceFilter = ([min, max]: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentMin = Number(params.get("minPrice")) || 0;
    const currentMax = Number(params.get("maxPrice")) || 100000;
    if (min === currentMin && max === currentMax) return;
    params.set("minPrice", String(min));
    params.set("maxPrice", String(max));
    updateRoute(params);
  };

  const prevPageHandler = () => {
    const params = updatePageParam(searchParams, currentPageParam - 1);
    updateRoute(params);
  };

  const goToPageHandler = (page: number) => {
    const params = updatePageParam(searchParams, page);
    updateRoute(params);
  };

  return (
    <div className="p-6">
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          {category && formatCategoryName(category as string)} Listing Page
        </h1>
        <p className="text-lg">Explore our wide range of products!</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">All Products</h2>
          <div className="flex item-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="p-2 rounded bg-gray-200 flex items-center gap-2 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <FilterSection
                    categories={categoryParam?.split(",") || []}
                    brands={brandsParam?.split(",") || []}
                    sizes={sizesParam?.split(",") || []}
                    minPrice={minPriceParam}
                    maxPrice={maxPriceParam}
                    productCategories={productCategories}
                    productLookup={productLookup}
                    updateFilter={updateFilter}
                    updatePriceFilter={updatePriceFilter}
                    category={category}
                    maxPriceDefault={maxPriceDefault}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <div>
              <Select
                value={sortByParam}
                onValueChange={(value) => updateFilter("sortBy", value, false)}
              >
                <SelectTrigger aria-label="Sort products">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>

                <SelectContent>
                  {sortByOptions?.map((sort) => (
                    <SelectItem key={sort.label} value={sort.value}>
                      {sort.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSection
              categories={categoryParam?.split(",") || []}
              brands={brandsParam?.split(",") || []}
              sizes={sizesParam?.split(",") || []}
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              productCategories={productCategories}
              productLookup={productLookup}
              updateFilter={updateFilter}
              updatePriceFilter={updatePriceFilter}
              category={category}
              maxPriceDefault={maxPriceDefault}
            />
          </div>
          <ProductGrid products={products} productLookup={productLookup} />
        </div>

        <Pagination
          currentPage={currentPageParam}
          totalPages={totalPages as number}
          onPrevPage={prevPageHandler}
          onNextPage={nextPageHandler}
          onGoToPage={goToPageHandler}
        />
      </div>
    </div>
  );
}

export default CategoryListing;
