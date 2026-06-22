export interface FeatureBanner {
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
