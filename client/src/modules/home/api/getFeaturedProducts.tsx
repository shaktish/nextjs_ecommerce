export async function getFeaturedProducts() {
  const response = await fetch(
    `${process.env.API_URL}/api/product/feature-products`,
    {
      next: {
        revalidate: 0,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch featured products");
  }

  return response.json();
}
