import { Product } from "@/store/useProductStore";
import { Variant } from "@/types/product.types";
import { Metadata } from "next";

export function buildProductMetaData(product: Product<Variant>): Metadata {
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]?.url],
    },
  };
}
