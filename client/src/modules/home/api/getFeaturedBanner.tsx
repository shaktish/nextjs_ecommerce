import { HOME_BANNER } from "@/constant/invalidateCacheConstant";
import { backendClient } from "@/lib/backend/client";

export async function getFeaturedBanner() {
  const { response } = await backendClient(`/api/feature-banner`, {
    next: {
      revalidate: 3600,
      tags: [HOME_BANNER],
    },
    skipAuth: true,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch feature banners");
  }
  return response.json();
}
