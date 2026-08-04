import bffFetch from "@/lib/bffClient";

async function addProduct(product: FormData) {
  const response = await bffFetch(`/product`, {
    method: "POST",
    body: product,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to add the product");
  }
  return response.json();
}

export default addProduct;
