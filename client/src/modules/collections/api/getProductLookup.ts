export async function getProductLookup() {
  const response = await fetch(`${process.env.API_URL}/api/product/lookup`, {
    next: {
      revalidate: 3600,
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching product lookup");
  }
  return response.json();
}
