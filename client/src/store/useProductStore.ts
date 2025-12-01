import axiosClient from '@/utils/axios';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type Product = {
    id: string;
    name: string;
    brand: string;
    description: string;
    category: string;
    gender: "male" | "female" | "unisex";
    sizes: string[];
    colors: string[];
    price: number;
    stock: number;
    soldCount: number;
    rating?: number | null;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    isFeatured: boolean;
}

type CreateProductInput = {
    name: string;
    brand: string;
    description: string;
    category: string;
    gender: string;
    sizes: string[];
    colors: string[];
    price: number;
    stock: number;
    files: File[];
    isFeatured: boolean;
}

type UpdateProductInput = {
    name: string;
    brand: string;
    description: string;
    category: string;
    gender: string;
    sizes: string[];
    colors: string[];
    price: number;
    stock: number;
    files: string[];
    isFeatured: boolean;
}

interface CreateProductResponse {
    message: string,
    data?: {
        id: string,
        name: string
    }[]
}



type ProductStore = {
    products: Product[] | null;
    isLoading: boolean,
    error: {
        message: string,
        details?: string[]
    } | null,
    addProduct: (product: FormData) => Promise<string | null>;
    getAllProductAdmin: () => Promise<void>;
    updateProduct: (id: string, product: UpdateProductInput) => Promise<string | null>;
    removeProduct: (id: string) => Promise<string | null>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
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
    getAllProductAdmin: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.get('/product')
            set({
                isLoading: false,
                products: response.data.data
            })
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string }>;
            set({
                isLoading: false,
                error: axiosError.response?.data?.message ||
                    axiosError.message ||
                    "Failed to get all product",
            })
        }

    },
    updateProduct: async (id: string, product: UpdateProductInput) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axiosClient.put(`/product/${id}`, {
                ...product,
            }, {
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
            const axiosError = e as AxiosError<{ message?: string }>;
            set({
                isLoading: false,
                error: axiosError.response?.data?.message ||
                    axiosError.message ||
                    "Failed to update the product",
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
            return response.data.data.id ?? null;
        } catch (e) {
            const axiosError = e as AxiosError<{ message?: string }>;
            set({
                isLoading: false,
                error: axiosError.response?.data?.message ||
                    axiosError.message ||
                    "Failed to remove the product",
            })
            return null
        }

    }

}))