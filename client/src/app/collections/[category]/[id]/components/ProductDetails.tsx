import { Product, ProductLookup } from "@/store/useProductStore";
import { Variant } from "@/types/product.types";
import Image from "next/image";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductAction";

interface Details {
  productLookup: ProductLookup;
  product: Product<Variant>;
}

function Details({ product, productLookup }: Details) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Images */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {product?.images?.map((image) => (
            <div
              className="aspect-[3/4] overflow-hidden rounded-lg relative"
              key={image.id}
            >
              <Image
                src={image.url}
                alt={product.name}
                className="w-full h-full object-cover"
                fill
              />
            </div>
          ))}
        </div>

        <div className="flex-1">
          <ProductInfo description={product.description} name={product.name} />
          <ProductActions
            productLookup={productLookup}
            variants={product.variants}
          />
        </div>
      </div>
    </div>
  );
}

export default Details;
