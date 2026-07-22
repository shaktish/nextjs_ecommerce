import { AuthUser } from "@/modules/auth/auth.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (data: AuthUser | null) => {
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
