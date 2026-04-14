import { Button } from "@/components/ui/button";
import { Product } from "@/store/useProductStore";

interface FeaturedProductsProps {
  featureProducts: Product[];
}

const FeaturedProducts = ({ featureProducts }: FeaturedProductsProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-semibold mb-2">
          New Arrivals
        </h2>
        <p className="text-center mb-8 text-gray-500">
          Designed to keep your satisfaction and warmth
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featureProducts &&
            featureProducts.map((productItem) => {
              return (
                <div
                  key={productItem.id}
                  className="relative group overflow-hidden"
                >
                  <div className="aspect-[3/4]">
                    <img
                      src={productItem.images[0].url}
                      alt={productItem.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex justify-center items-center opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                    <div className="text-center text-white p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {productItem.name}
                      </h3>
                      <Button className="cursor-pointer mt-4 bg-white text-black hover:bg-white">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};
export default FeaturedProducts;
