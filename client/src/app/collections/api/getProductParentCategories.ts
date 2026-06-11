export async function getParentCategories() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/product-categories`,
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
