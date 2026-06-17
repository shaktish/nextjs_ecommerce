export async function getFeaturedBanner() {
  const response = await fetch(`${process.env.API_URL}/api/feature-banner`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  //   console.log(response.json(), "respons feature banner");
  return response.json();
}
