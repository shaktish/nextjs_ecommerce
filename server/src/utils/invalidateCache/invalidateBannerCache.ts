import { invalidateCache } from "./invalidateCache";

export const invalidateBannerCache = async () => {
  await invalidateCache("/api/revalidate-home-banner");
};
