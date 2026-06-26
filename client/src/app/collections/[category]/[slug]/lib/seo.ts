import { Product } from "@/store/useProductStore";
import { Variant } from "@/types/product.types";
import { Metadata } from "next";

export function buildProductMetaData(product: Product<Variant>): Metadata {
  const image = product.images[0]?.url ?? "/default-product.png";

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [image],
    },
  };
}
