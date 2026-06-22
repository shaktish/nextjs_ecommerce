import Link from "next/link";
import { Product } from "@/store/useProductStore";
import { Variant } from "@/types/product.types";
import Image from "next/image";

interface FeaturedProductsProps {
  featureProducts: Product<Variant>[];
}

const FeaturedProducts = ({ featureProducts }: FeaturedProductsProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-semibold mb-2">
          New Arrivals
        </h2>
        <p className="text-center mb-8 text-muted-foreground">
          Designed to keep your satisfaction and warmth
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featureProducts?.map((productItem) => (
            <Link
              href={`/collections/men/${productItem.slug}`}
              key={productItem.id}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg">
                <div className="aspect-[3/4]">
                  {productItem.images?.[0]?.url ? (
                    <Image
                      src={productItem.images[0].url}
                      alt={productItem.name}
                      width={400}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div
                  className="
                    absolute inset-0
                    hidden md:flex
                    items-center justify-center
                    bg-gradient-to-t from-black/70 via-black/30 to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300"
                >
                  <div className="text-center text-white">
                    <p className="font-medium">Shop Now</p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-medium text-sm md:text-base line-clamp-2">
                  {productItem.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturedProducts;
