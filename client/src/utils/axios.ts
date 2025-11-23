// src/utils/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api",
    withCredentials: true,    // ✅ include cookies in every request
});

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

axiosClient.interceptors.response.use(
    (response) => response, // ✅ just pass through successful responses
    async (error) => {
        const originalRequest = error.config;
        console.log(error, 'axios error')
        // 1️⃣ Check if token expired (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // 2️⃣ If another refresh already happening → queue the request
            if (isRefreshing) {
                return new Promise((resolve) => {
                    pendingRequests.push(() => resolve(axiosClient(originalRequest)));
                });
            }

            isRefreshing = true;
            try {
                // 3️⃣ Call refresh API (cookies included)
                console.log("calling refreshToken")
                await axios.post(
                    "/api/auth/refreshToken",
                    {},
                    { withCredentials: true }
                );

                // 4️⃣ Release queued requests
                pendingRequests.forEach((cb) => cb());
                pendingRequests = [];
                isRefreshing = false;

                // 5️⃣ Retry the original request
                return axiosClient(originalRequest);
            } catch (refreshErr) {
                isRefreshing = false;
                pendingRequests = [];
                console.log("🔴 Refresh failed — redirecting to login");
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
