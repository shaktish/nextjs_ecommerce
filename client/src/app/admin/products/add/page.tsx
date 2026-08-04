import { Suspense } from "react";
import AddProductForm from "./AddProduct";
import getProductLookup from "@/modules/collections/api/getProductLookup";
import getCategoriesLookup from "@/modules/collections/api/getCategoriesLookup";
import getProduct from "@/modules/collections/api/getProduct";

type Props = {
  searchParams: Promise<{
    id?: string;
  }>;
};

async function AddProductAdmin({ searchParams }: Props) {
  const { id } = await searchParams;

  const [productLookup, categoriesLookup, product] = await Promise.all([
    getProductLookup(),
    getCategoriesLookup(),
    id ? getProduct(id) : Promise.resolve(undefined),
  ]);

  return (
    <Suspense fallback="loading...">
      <AddProductForm
        productLookup={productLookup}
        categoriesLookup={categoriesLookup}
        product={product}
        editProductId={id}
      />
    </Suspense>
  );
}

export default AddProductAdmin;
