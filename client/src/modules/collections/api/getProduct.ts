"use server";
import withServerComponentAuth from "@/lib/auth/withServerComponentAuth";
import { backendClient } from "@/lib/backend/client";

async function getProduct(id: string) {
  return withServerComponentAuth(async () => {
    const { response } = await backendClient(`/api/product/admin/${id}`);
    return response.json();
  });
}

export default getProduct;
