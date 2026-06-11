export async function getFeaturedProducts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/feature-products`,
    {
      next: {
        revalidate: 300,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch featured products");
  }

  return response.json();
}
