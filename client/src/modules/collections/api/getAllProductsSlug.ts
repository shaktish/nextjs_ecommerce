export async function getAllProductsSlug() {
  const response = await fetch(`${process.env.API_URL}/api/product/slug`, {
    next: {
      revalidate: 3600,
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching product lookup");
  }
  return response.json();
}
