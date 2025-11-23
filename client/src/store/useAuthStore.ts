import axiosClient from '@/utils/axios';
import axios from 'axios';
import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type User = {
    id: string,
    name: string | null,
    email: string,
    role: 'User' | 'Admin',
}

interface RegisterUserFormData {
    name: string,
    email: string,
    password: string
}

type LoginUserFormData = Omit<RegisterUserFormData, "name">


type AuthStore = {
    user: User | null,
    isLoading: boolean,
    error: string | null,
    register: (userFormData: RegisterUserFormData) => Promise<string | null>,
    login: (userFormData: LoginUserFormData) => Promise<boolean | null>,
    logout: () => Promise<boolean>;
    refreshAccessToken: () => Promise<boolean>
}

// const axiosInstance = axios.create({
//     baseURL: API_ROUTES.AUTH,
//     withCredentials: true
// });

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            error: null,
            register: async (userFormData: RegisterUserFormData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await axiosClient.post('/auth/register', {
                        ...userFormData,
                    })
                    set({
                        isLoading: false,
                    })
                    console.log(response, 'response');
                    return response.data.data.id ?? null;
                } catch (e) {
                    console.log(e, 'e');
                    const errorMessage = axios.isAxiosError(e) ? e?.response?.data?.message : 'Registration Failed'
                    set({ isLoading: false, error: errorMessage })
                    return null;
                }
            },
            login: async (userFormData: LoginUserFormData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axiosClient.post('/auth/login', {
                        ...userFormData,
                    })
                    console.log(response, 'response');
                    set({
                        isLoading: false,
                        user: response.data.user
                    })
                    return true
                } catch (e) {
                    console.log(e, 'e');
                    set({ isLoading: false, error: axios.isAxiosError(e) ? e?.response?.data?.error : 'Login Failed' })
                    return null
                }
            },
            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await axiosClient.post('/auth/logout')
                    set({ isLoading: false, user: null });
                    return true;
                } catch (e) {
                    console.error("Logout Error:", e);
                    set({ isLoading: false, error: axios.isAxiosError(e) ? e?.response?.data?.error : 'Logout Failed' })
                    return false
                }
            },
            refreshAccessToken: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axiosClient.post('/auth/refreshToken')
                    set({
                        isLoading: false,
                    })
                    return !!response.data?.success;

                } catch (e) {
                    console.error("Refresh Token Error:", e);
                    set({ isLoading: false, error: axios.isAxiosError(e) ? e?.response?.data?.error : 'Logout Failed' })
                    return false;

                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user })
        }
    )
)