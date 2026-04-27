import { Category, ProductApiResponse, Variant } from '@/types/product.types';
import axiosClient from '@/utils/axios';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand'

export interface ClientProductParams {
    page?: number;
    limit?: number;
    category: string;
    categories?: string;
    brands?: string;
    sizes?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
}

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
    variants: Variant[];
}

type ProductStore = {
    featureProducts: Product[];
    // get product by id for client side
    product: Product | null;
    // get list of products for client side with pagination and filters
    products: Product[] | null;
    productLookup: ProductLookup;
    productParentCategories: Category[];
    productCategories: {
        [parentId: string]: Category[];
    } | null;
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
    getProduct: (id: string) => Promise<void | null>;
    getFeatureProducts: () => Promise<void>;
    getLookup: () => Promise<void>;
    getCategoriesLookup: () => Promise<void>;
    getProductCategories: (parentId?: string) => Promise<void>;
    getProductsForClient: (params: ClientProductParams) => Promise<void>;
    clientTotalPages?: number;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    product: null,
    featureProducts: [],
    productParentCategories: [],
    productCategories: null,
    productLookup: null,
    categoriesLookup: [],
    isLoading: true,
    error: null,
    clientTotalPages: 0,
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
            set({ isLoading: true, error: null, product: null });
            const response = await axiosClient(`/product/${id}`)
            set({ isLoading: false, error: null, product: response.data });
            return response.data;
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
            const response = await axiosClient.get<Category[]>('/product/lookup-categories')
            set({
                isLoading: false,
                categoriesLookup: response?.data
            });
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to getCategoriesLookup",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
    getProductCategories: async (parentId?: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get<Category[]>('/product/product-categories', { params: { parentId } });
            if (parentId) {
                set({
                    isLoading: false,
                    productCategories: {
                        ...get().productCategories,
                        [parentId]: response?.data || []
                    }
                });
            } else {
                set({
                    isLoading: false,
                    productParentCategories: response?.data || []
                });
            }

        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to getProductCategories",
                    details: axiosError.response?.data?.details
                }
            })
        }
    },
    getProductsForClient: async (params: { page?: number; limit?: number }) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get('/product/get-products', { params, withCredentials: true });
            set({
                isLoading: false,
                products: response?.data?.data || [],
                clientTotalPages: response?.data?.totalPages || 0,
            });
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string, details?: string[] }>;
            set({
                isLoading: false,
                error: {
                    message: axiosError.response?.data?.message || axiosError.message || "Failed to get products for client",
                    details: axiosError.response?.data?.details
                }
            })
        }
    }


}))