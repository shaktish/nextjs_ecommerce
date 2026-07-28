import login from "@/modules/auth/api/login";
import logout from "@/modules/auth/api/logout";
import register from "@/modules/auth/api/register";
import { AuthUser } from "@/modules/auth/auth.types";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RegisterUserFormData {
  name: string;
  email: string;
  password: string;
}

export type ApiResponse<T> =
  | {
      success: boolean;
      data: T;
      message?: never;
    }
  | {
      success: boolean;
      message: string;
      data?: never;
    };

type LoginUserFormData = Omit<RegisterUserFormData, "name">;

type AuthStore = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  register: (userFormData: RegisterUserFormData) => Promise<ApiResponse<any>>;
  login: (userFormData: LoginUserFormData) => Promise<AuthUser | null>;
  logout: () => Promise<boolean>;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      register: async (userFormData: RegisterUserFormData) => {
        set({ isLoading: true });
        try {
          const response = await register(userFormData);
          return response;
        } finally {
          set({ isLoading: false });
        }
      },
      login: async (userFormData: LoginUserFormData) => {
        set({ isLoading: true, error: null });
        let response = null;
        try {
          response = await login({
            ...userFormData,
          });
          set({
            isLoading: false,
            user: response.user,
          });
          return response.user;
        } catch (e) {
          let message = "Login Failed";
          if (axios.isAxiosError(e)) {
            message = e.response?.data?.message;
          }
          set({
            isLoading: false,
            error: message,
          });
          return null;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await logout();
          set({ isLoading: false, user: null });
          return true;
        } catch (e) {
          console.error("Logout Error:", e);
          set({
            isLoading: false,
            error: axios.isAxiosError(e)
              ? e?.response?.data?.error
              : "Logout Failed",
          });
          return false;
        }
      },
      setUser: async (data: AuthUser | null) => {
        set({
          user: data,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
