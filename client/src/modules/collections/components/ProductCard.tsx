import { Product } from "@/store/useProductStore";
import { Variant } from "@/types/product.types";
import Image from "next/image";
import ProductPreview from "../../../../public/images/product-preview.jpeg";

interface ProductCard<T> {
  product: Product<T>;
}

function ProductCard<T>({ product }: ProductCard<T>) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-[3/4]">
        <Image
          src={product?.images[0]?.url || ProductPreview}
          alt={product.name}
          width={400}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div
        className="absolute inset-0
                    hidden md:flex
                    items-center justify-center
                    bg-gradient-to-t from-black/70 via-black/30 to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300"
      >
        <div className="text-center text-white">
          <p className="font-medium">Quick View</p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
