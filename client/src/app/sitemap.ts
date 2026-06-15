import { getAllProductsSlug } from "@/modules/collections/api/getAllProductsSlug";
import { getProductCategories } from "@/modules/collections/api/getProductCategories";
import { Category, ProductSlug } from "@/types/product.types";
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log("Generating sitemap");

  const [productsCategories, products] = await Promise.all([
    getProductCategories(),
    getAllProductsSlug(),
  ]);

  console.log(productsCategories, "CATEGORIES");

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: new Date(),
    },
    ...productsCategories.map((productCategory: Category) => {
      return {
        url: `${BASE_URL}/collections/${productCategory.slug}`,
        lastModified: productCategory.updatedAt,
      };
    }),
    ...products.map((product: ProductSlug) => {
      return {
        url: `${BASE_URL}/collections/${product.categorySlug}/${product.slug}`,
        lastModified: product.updatedAt,
      };
    }),
  ];
}
