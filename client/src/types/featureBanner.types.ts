export interface FeatureBannerFormatted {
  id: string;
  file?: File;
  preview: string;
  isNew: boolean;
  publicId?: string;
  redirectUrl?: string;
  hasError?: boolean;
  isOriginalRedirectUrl?: string;
  isOriginalSortOrder?: number;
}

export interface FeatureBanner {
  id: string;
  url: string;
  publicId: string;
  redirectUrl: string;
  sortOrder: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type FeatureBannersResponse = FeatureBanner[];
