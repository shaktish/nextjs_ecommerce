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
import { ClientProductParams, useProductStore } from "@/store/useProductStore";
import { useParams } from "next/navigation";

import { SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { FilterSection } from "./components/Filters";
import { ProductGrid } from "./components/ProductGrid";
import { Pagination } from "./components/Pagination";
import { sortByOptions } from "./constants/constants";
import { formatCategoryName } from "./utils/formatCategoryName";
import { buildQueryParams, updatePageParam } from "./utils/queryParams";
import { ProductSkeleton } from "./components/skeleton/ProductSkeleton";

function CategoryListing() {
  const minPriceDefault = 0;
  const maxPriceDefault = 10000;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  // parent category
  const category = params.category as string;
  // url params for filters
  const categoryParam = searchParams.get("categories") || "";
  const brandsParam = searchParams.get("brands") || "";
  const sizesParam = searchParams.get("sizes") || "";
  const sortByParam = searchParams.get("sortBy") || sortByOptions[0].value;
  const minPriceParam = Number(searchParams.get("minPrice")) || minPriceDefault;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || maxPriceDefault;
  const currentPageParam = Number(searchParams.get("page")) || 1;
  const limitPageParam = Number(searchParams.get("limit")) || 10;

  const {
    isLoading,
    productCategories,
    getLookup,
    productLookup,
    getProductCategories,
    getProductsForClient,
    products,
    clientTotalPages: totalPages,
  } = useProductStore();

  useEffect(() => {
    const payload: ClientProductParams = {
      category,
      sortBy: sortByParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
    };

    if (categoryParam.length) {
      payload.categories = categoryParam;
    }

    if (brandsParam.length) {
      payload.brands = brandsParam;
    }

    if (sizesParam.length) {
      payload.sizes = sizesParam;
    }

    if (limitPageParam) {
      payload.limit = limitPageParam;
    }

    if (currentPageParam) {
      payload.page = currentPageParam;
    }

    getProductsForClient({
      page: currentPageParam,
      limit: limitPageParam,
      ...payload,
    });
  }, [
    categoryParam,
    brandsParam,
    sizesParam,
    sortByParam,
    category,
    getProductsForClient,
    minPriceParam,
    maxPriceParam,
    limitPageParam,
    currentPageParam,
  ]);

  useEffect(() => {
    if (!category) return;

    const existing = productCategories?.[category];

    if (!existing || !existing.length) {
      getProductCategories(category);
    }
  }, [category, getProductCategories, productCategories]);

  useEffect(() => {
    if (!productLookup) {
      getLookup();
    }
  }, [productLookup, getLookup]);

  const updateFilter = (key: string, value: string, isMulti = true) => {
    const params = buildQueryParams(searchParams, key, value, isMulti);
    router.push(`${pathname}?${params.toString()}`);
  };

  const nextPageHandler = () => {
    const params = updatePageParam(searchParams, currentPageParam + 1);
    router.push(`${pathname}?${params.toString()}`);
  };

  const updatePriceFilter = ([min, max]: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentMin = Number(params.get("minPrice")) || 0;
    const currentMax = Number(params.get("maxPrice")) || 100000;
    if (min === currentMin && max === currentMax) return;
    params.set("minPrice", String(min));
    params.set("maxPrice", String(max));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const prevPageHandler = () => {
    const params = updatePageParam(searchParams, currentPageParam - 1);
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToPageHandler = (page: number) => {
    const params = updatePageParam(searchParams, page);
    router.push(`${pathname}?${params.toString()}`);
  };
  console.log(isLoading, "isLoading");
  return (
    <div className="p-6">
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
                <SelectTrigger>
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
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} productLookup={productLookup} />
            )}
          </>
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
