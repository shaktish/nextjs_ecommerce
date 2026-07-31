/**
 * Client-side fetch wrapper for the Next.js BFF.
 *
 * Responsibilities:
 * - Routes client-side API requests through the BFF.
 * - Lets the BFF handle cookie forwarding, token refresh,
 *   and request retries.
 * - Redirects the user to the login page when authentication
 *   has expired.
 *
 * Used only in Client Components.
 */

import { useAuthStore } from "@/store/useAuthStore";

export default async function bffFetch(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
) {
  const response = await fetch(`/api/bff${path}`, {
    credentials: "include",
    ...init,
  });
  if (response.status === 401) {
    console.log("bffFetch - user is logged out due to refresh token expired");
    const body = await response
      .clone()
      .json()
      .catch(() => null);

    if (body?.code === "AUTH_EXPIRED") {
      useAuthStore.getState().setUser(null);
      window.location.replace("/auth/login");
    }
  }
  return response;
}
