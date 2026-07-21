import { backendClient } from "@/lib/backend/client";

export async function getProductLookup() {
  const { response } = await backendClient(`/api/product/lookup`, {
    next: {
      revalidate: 3600,
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching product lookup");
  }
  return response.json();
}
