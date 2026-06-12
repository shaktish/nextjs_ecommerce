import CategoryListing from "./CategoryListing";
import getProductList from "@/modules/collections/api/getProductList";
import { getParentCategories } from "@/modules/collections/api/getProductParentCategories";
import { getProductLookup } from "@/modules/collections/api/getProductLookup";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    category?: string;
    categories?: string;
    brands?: string;
    sizes?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
  }>;
}

const paramsList = [
  "category",
  "categories",
  "brands",
  "sizes",
  "sortBy",
  "minPrice",
  "maxPrice",
  "page",
  "limit",
];

async function ListingPage({ searchParams, params }: PageProps) {
  const searchParamsObj = await searchParams;
  const { category } = await params;

  const queryParams = new URLSearchParams();
  if (category) {
    queryParams.set("category", category);
  }

  Object.entries(searchParamsObj).forEach(([key, value]) => {
    if (value && paramsList.includes(key)) {
      queryParams.set(key, value);
    }
  });

  const [productLookup, productCategories, products] = await Promise.all([
    getProductLookup(),
    getParentCategories(category),
    getProductList(queryParams),
  ]);

  return (
    <div className="p-6">
      <CategoryListing
        products={products?.data}
        productCategories={productCategories}
        productLookup={productLookup}
        totalPages={products?.totalPages}
      />
    </div>
  );
}

export default ListingPage;
