// uses bff route handlers as it upload images to the backend

import bffFetch from "@/lib/bffClient";
import { FeatureBanner } from "@/types/featureBanner.types";

async function addBanner(
  data: FormData,
): Promise<{ data: FeatureBanner[]; message: string }> {
  const response = await bffFetch(`/feature-banner`, {
    method: "PATCH",
    body: data,
  });
  if (!response.ok) {
    throw new Error("Failed to add feature banner");
  }

  return response.json();
}

export default addBanner;
