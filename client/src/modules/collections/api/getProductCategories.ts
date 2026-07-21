import { backendClient } from "@/lib/backend/client";

export async function getProductCategories(parentId?: string) {
  const queryParams = new URLSearchParams();

  if (parentId) {
    queryParams.set("parentId", parentId);
  }
  const { response } = await backendClient(`/api/product/product-categories`, {
    next: {
      revalidate: 300, // 5mins
      tags: ["products"],
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}
