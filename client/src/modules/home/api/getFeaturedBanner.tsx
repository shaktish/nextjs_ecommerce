import { HOME_BANNER } from "@/constant/invalidateCacheConstant";

export async function getFeaturedBanner() {
  const response = await fetch(`${process.env.API_URL}/api/feature-banner`, {
    next: {
      revalidate: 3600,
      tags: [HOME_BANNER],
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}
