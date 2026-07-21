import { backendClient } from "@/lib/backend/client";

async function getProductBySlug(slug: string) {
  const { response } = await backendClient(`/api/product/${slug}`, {
    next: {
      tags: [`product-${slug}`],
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching product details");
  }

  return response.json();
}

export default getProductBySlug;
