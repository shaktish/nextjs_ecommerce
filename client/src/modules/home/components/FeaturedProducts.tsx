import Link from "next/link";
import { Product } from "@/store/useProductStore";
import { Variant } from "@/types/product.types";
import ProductCard from "@/modules/collections/components/ProductCard";

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
              <ProductCard product={productItem} />
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
