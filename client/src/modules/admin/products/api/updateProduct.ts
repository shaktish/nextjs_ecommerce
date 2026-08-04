import bffFetch from "@/lib/bffClient";

async function updateProduct(id: string, product: FormData) {
  const response = await bffFetch(`/product/${id}`, {
    method: "PATCH",
    body: product,
  });
  console.log(response, "res");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to update the product");
  }
  console.log(response, "response");
  return response.json();
}

export default updateProduct;
