import bffFetch from "@/lib/bffClient";
import { FeatureBannersResponse } from "@/types/featureBanner.types";

export async function getFeaturedBannerClient(): Promise<{
  data: FeatureBannersResponse;
}> {
  const response = await bffFetch(`/feature-banner`, {
    skipAuth: true,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch feature banners");
  }
  return response.json();
}
