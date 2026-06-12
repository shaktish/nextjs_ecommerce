export async function getParentCategories(parentId?: string) {
  const queryParams = new URLSearchParams();

  if (parentId) {
    queryParams.set("parentId", parentId);
  }
  const response = await fetch(
    `${process.env.API_URL}/api/product/product-categories`,
    {
      next: {
        revalidate: 3600, // 1 hour
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}
