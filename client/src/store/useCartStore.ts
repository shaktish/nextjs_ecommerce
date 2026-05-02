import axiosClient from '@/utils/axios'
import { create } from 'zustand'

export interface UpdateQuantityCartPayload { cartItemId: string, variantId: string, quantity: number }

export interface CartItem {
    id: string
    name: string
    variantId: string
    quantity: number
    price: number,
    size: string,
    image: string,
    stock: number,
}

type CartStore = {
    cartId: string | null;
    items: CartItem[],
    isLoading: boolean,
    error: string | null;
    addToCart: (data: { variantId: string, quantity: number }) => Promise<boolean>,
    updateCartItemQuantity: (data: UpdateQuantityCartPayload) => Promise<{ success: boolean, message: string }>,
    deleteCartItem: (id: string) => Promise<boolean>,
    getCartItems: () => Promise<void>
    clearAllItems: (cartId: string) => Promise<void>,
}

export const useCartStore = create<CartStore>((set, get) => ({
    cartId: null,
    items: [],
    isLoading: false,
    error: null,
    addToCart: async (data: { variantId: string, quantity: number }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosClient.post('/cart', data, { withCredentials: true });
            const item: CartItem = response.data.data.items;
            const updated = [...get().items, item]
            set({ items: updated, isLoading: false, error: null });
            return true
        } catch (e: any) {
            set({
                isLoading: false,
                error: e?.response?.data?.message,
            })
            return false
        }
    },
    updateCartItemQuantity: async (data: UpdateQuantityCartPayload) => {
        try {
            set({ isLoading: true, error: null });
            const updatedItems = get().items.map(item =>
                item.id === data.cartItemId
                    ? { ...item, quantity: data.quantity }
                    : item
            );
            console.log(updatedItems, 'updatedItems')
            set({
                items: updatedItems,
                isLoading: false,
                error: null
            });


            const response = await axiosClient.patch(
                '/cart',
                data,
                { withCredentials: true }
            );

            return { success: response.data.success, message: response.data.message };

        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || "Failed to update cart"
            });
            return { success: false, message: error?.response?.data?.message || "Failed to update cart" };
        }
    },
    deleteCartItem: async (id: string) => {
        const previousItems = get().items;

        set({ items: previousItems.filter(item => item.id !== id), isLoading: true, error: null });
        try {
            await axiosClient.delete(`/cart/item/${id}`, { withCredentials: true });
            set({ isLoading: false, error: null });
            return true;
        } catch (error: any) {
            set({
                items: previousItems,
                isLoading: false,
                error: "Failed to delete item"
            });
            return false;
        }
    },
    getCartItems: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosClient.get('/cart', { withCredentials: true })
            set({ items: response.data?.data.items, cartId: response.data.data.cartId, isLoading: false, error: null });
        } catch (e: any) {
            set({
                isLoading: false,
                error: "Failed to getCart item"
            });
        }
    },
    clearAllItems: async () => {
        const previousItems = get().items;
        try {
            set({ items: [], isLoading: true, error: null });
            await axiosClient.delete('/cart', { withCredentials: true })
            set({ isLoading: false, error: null });
        } catch (e: any) {
            set({
                items: previousItems,
                isLoading: false,
                error: "Failed to clear cart"
            });
        }
    },
}))