import { backendClient } from "@/lib/backend/client";

export async function getFeaturedProducts() {
  const { response } = await backendClient(`/api/product/feature-products`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch featured products");
  }

  return response.json();
}
