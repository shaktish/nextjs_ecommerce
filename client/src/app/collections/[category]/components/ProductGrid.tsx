"use client";

import { Button } from "@/components/ui/button";
import { Product, ProductLookup } from "@/store/useProductStore";
import { formatPrice } from "@/utils/number";
import { useRouter } from "next/navigation";

interface ProductGridProps {
  products: Product[] | null;
  productLookup: ProductLookup | null;
}

export function ProductGrid({ products, productLookup }: ProductGridProps) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products &&
        products.map((product) => {
          return (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] mb-4 bg-gray-100 overflow-hidden">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    className="bg-white text-black hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      router.push(`/collections/men/${product.id}`)
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex items-center justify-between">
                <div className="mt-3 text-sm w-full">
                  <div className="grid grid-cols-2 font-semibold border-b pb-1">
                    <span>Size</span>
                    <span>Price</span>
                  </div>

                  {product.variants.map((variant) => {
                    const size = productLookup?.size?.find(
                      (s) => s.id === variant.sizeId,
                    );
                    return (
                      <div
                        key={variant.id}
                        className="grid grid-cols-2 py-1 text-muted-foreground"
                      >
                        <span>{size?.name}</span>
                        <span>{formatPrice(variant.price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
