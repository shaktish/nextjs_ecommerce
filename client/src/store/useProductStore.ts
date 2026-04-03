import { Category, ProductApiResponse } from '@/types/product.types';
import axiosClient from '@/utils/axios';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand'

export interface ProductImage {
    id: string,
    url: string,
    publicId: string,
}

type LookupItem = {
    id: string;
    name: string;
};

export type ProductLookup = {
    brands: LookupItem[];
    gender: LookupItem[];
    size: LookupItem[];
} | null;

export type Product = {
    id: string;
    name: string;
    brandId: string;
    description: string;
    categoryId: string;
    price: number;
    stock: number;
    soldCount: number;
    rating?: number | null;
    images: ProductImage[];
    createdAt: Date;
    updatedAt: Date;
    isFeatured: boolean;
}

type ProductStore = {
    featureProducts: Product[];
    products: Product[] | null;
    productLookup: ProductLookup;
    categoriesLookup: Category[];
    isLoading: boolean,
    error: {
        message: string,
        details?: string[]
    } | null,
    addProduct: (product: FormData) => Promise<string | null>;
    getAllProductAdmin: () => Promise<void>;
    updateProduct: (id: string, product: FormData) => Promise<string | null>;
    removeProduct: (id: string) => Promise<string | null>;
    getProduct: (id: string) => Promise<ProductApiResponse | null>;
    getFeatureProducts: () => Promise<void>;
    getLookup: () => Promise<void>;
    getCategoriesLookup: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    featureProducts: [],
    productLookup: null,
    categoriesLookup: [],
    isLoading: false,
    error: null,
    addProduct: async (product: FormData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.post('/product',
                product
                , {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
            set({
                isLoading: false,
            })
            console.log(response, 'CreateProductInput response');
            return response.data.data.id ?? null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to create the product",
                    details: axiosError.response?.data?.details
                }
            })
            return null;
        }

    },
    getProduct: async (id: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get<ProductApiResponse>(`/product/${id}`)
            set({ isLoading: false, error: null });
            return response?.data || null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to get the product",
                    details: axiosError.response?.data?.details
                }
            })
            return null;
        }
    },
    getAllProductAdmin: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get('/product/getAllProductsAdmin')
            set({
                isLoading: false,
                products: response.data.data
            })
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to get all product",
                    details: axiosError.response?.data?.details
                }
            })

        }

    },
    updateProduct: async (id: string, product: FormData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.patch(`/product/${id}`, product, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            set({
                isLoading: false,
            })
            console.log(response, 'UpdateProductInput response');
            return response.data.data.id ?? null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to update the product",
                    details: axiosError.response?.data?.details
                }
            })
            return null
        }

    },
    removeProduct: async (id: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.delete(`/product/${id}`, {})
            set({
                isLoading: false,
            })
            return response.data.message ?? null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to remove the product",
                    details: axiosError.response?.data?.details
                }
            })
            return null
        }

    },
    getFeatureProducts: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get('/product/feature-products')
            set({
                isLoading: false,
                featureProducts: response?.data?.data
            });
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to create the product",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
    getLookup: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get('/product/lookup')
            set({
                isLoading: false,
                productLookup: response?.data
            });
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to create the product",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
    getCategoriesLookup: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get<Category[]>('/product/categories')
            set({
                isLoading: false,
                categoriesLookup: response?.data
            });
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to create the product",
                    details: axiosError.response?.data?.details
                }
            })
        }
    }


}))