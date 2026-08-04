"use server";
import withServerComponentAuth from "@/lib/auth/withServerComponentAuth";
import { backendClient } from "@/lib/backend/client";

async function deleteProduct(id: string) {
  return withServerComponentAuth(async () => {
    const { response } = await backendClient(`/api/product/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? "Failed to delete the product");
    }
    console.log(response, "response");
    return response.json();
  });
}

export default deleteProduct;
