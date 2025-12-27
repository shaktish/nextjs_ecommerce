import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';

type Coupon = {
    id: string;
    code: string;
    discountPercentage: number;
    startDate: Date | undefined;
    endDate: Date | undefined;
    usageLimit: number;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
}

type CouponImmutableFields = 'id' | 'createdAt' | 'updatedAt' | 'usageCount';


type CouponStore = {
    coupons: Coupon[];
    isLoading: boolean;
    error: {
        message: string,
        details?: string[]
    } | null,
    createCoupon: (coupon: Omit<Coupon, CouponImmutableFields>) => Promise<string | null>,
    updateCoupon: (id: string, coupon: Omit<Coupon, CouponImmutableFields>) => Promise<string | null>,
    removeCoupon: (id: string) => Promise<string | null>,
    getAllCoupon: () => Promise<void>,
    getCoupon: (id: string) => Promise<Coupon | null>
}

export const useCouponStore = create<CouponStore>((set, get) => ({
    coupons: [],
    isLoading: false,
    error: null,
    createCoupon: async (coupon: Omit<Coupon, CouponImmutableFields>) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.post('/coupon', coupon, { withCredentials: true });
            set({ isLoading: false, error: null });
            return response.data.data.id ?? null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to create the coupon",
                    details: axiosError.response?.data?.details
                }
            })
            return null;
        }
    },
    updateCoupon: async (id: string, data: Omit<Coupon, CouponImmutableFields>) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.patch(`/coupon/${id}`, data, { withCredentials: true });
            set({ isLoading: false, error: null });
            return response.data.data.id ?? null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to update the coupon",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
    getCoupon: async (id: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get(`/coupon/${id}`, { withCredentials: true });
            set({ isLoading: false, error: null });
            return response.data.data || null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to get the coupon",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
    getAllCoupon: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get('/coupon', { withCredentials: true });
            set({ isLoading: false, error: null, coupons: response?.data?.data || [] });
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to get the coupon",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
    removeCoupon: async (id: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.delete(`/coupon/${id}`, { withCredentials: true });
            set({ isLoading: false, error: null });
            return response.data.message ?? null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to delete the coupon",
                    details: axiosError.response?.data?.details
                }
            })
        }
    }
}))



