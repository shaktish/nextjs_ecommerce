import { FeatureBannerAPI } from "@/store/useFeatureBannerStore";
import { FeatureBanner } from "@/types/featureBanner.types";

export const formatBannerData = (item: FeatureBannerAPI): FeatureBanner => {
  return {
    id: item.id,
    publicId: item.publicId,
    preview: item.url,
    isNew: false,
    redirectUrl: item.redirectUrl,
    isOriginalRedirectUrl: item.redirectUrl,
    isOriginalSortOrder: item.sortOrder,
  };
};
