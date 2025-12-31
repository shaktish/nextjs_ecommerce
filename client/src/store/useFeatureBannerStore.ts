import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';

export interface FeatureBanner {
    id: string,
    url: string,
    publicId: string,
    sortOrder: number,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
}

type FeatureBannerStore = {
    isLoading: boolean;
    error: {
        message: string,
        details?: string[]
    } | null,
    createFeatureBanner: (coupon: FormData) => Promise<{ data: FeatureBanner[], message: string } | null>,
    updateFeatureBanner: (coupon: FormData) => Promise<{ data: FeatureBanner[], message: string } | null>,
    getAllFeatureBanners: () => Promise<FeatureBanner[]>,
}


export const useFeatureBannerStore = create<FeatureBannerStore>((set) => ({
    featureBanner: [],
    isLoading: false,
    error: null,
    createFeatureBanner: async (featureBanner: FormData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.post('/feature-banner', featureBanner, {
                withCredentials: true, headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            set({ isLoading: false, error: null });
            return response.data ?? null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to create the feature banner",
                    details: axiosError.response?.data?.details
                }
            })
            return null;
        }

    },
    updateFeatureBanner: async (featureBanner: FormData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.patch("/feature-banner", featureBanner, { withCredentials: true });
            set({ isLoading: false, error: null });
            return response.data;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to update the feature banner",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
    getAllFeatureBanners: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get("/feature-banner", { withCredentials: true });
            set({ isLoading: false, error: null });
            return response?.data?.data || []
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to fetch the feature banner",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
}))