"use server";

import withServerComponentAuth from "@/lib/auth/withServerComponentAuth";
import { backendClient } from "@/lib/backend/client";
import { Product, VariantForTable } from "@/types/product.types";

async function getAllProductsAdmin(): Promise<
  Product<VariantForTable>[] | null
> {
  return withServerComponentAuth(async () => {
    const { response } = await backendClient(
      "/api/product/getAllProductsAdmin",
    );
    return response.json();
  });
}

export default getAllProductsAdmin;
