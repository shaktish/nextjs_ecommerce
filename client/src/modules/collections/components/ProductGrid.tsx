"use client";
import { Product } from "@/store/useProductStore";
import { ProductLookup, VariantForTable } from "@/types/product.types";
import { formatPrice } from "@/utils/number";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface ProductGridProps {
  products: Product<VariantForTable>[] | null;
  productLookup: ProductLookup | null;
}

export function ProductGrid({ products, productLookup }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products &&
        products.map((product) => {
          return (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={() => router.push(`${pathname}/${product.slug}`)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0]?.url}
                    alt={product.name}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                    No Image
                  </div>
                )}

                {/* Desktop Hover Overlay */}
                <div
                  className="
                    absolute inset-0
                    hidden md:flex
                    items-center justify-center
                    bg-gradient-to-t from-black/70 via-black/30 to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300
                  "
                >
                  <div className="text-center text-white">
                    <p className="font-medium text-lg">Quick View</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-3">
                <h3 className="font-semibold text-base md:text-lg line-clamp-2">
                  {product.name}
                </h3>

                {/* Starting Price */}
                <p className="mt-1 text-sm text-muted-foreground">
                  From{" "}
                  {formatPrice(
                    Math.min(...product.variants.map((v) => v.price)),
                  )}
                </p>
              </div>

              {/* Size/Price Table */}
              <div className="mt-3 text-sm">
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
          );
        })}
    </div>
  );
}
