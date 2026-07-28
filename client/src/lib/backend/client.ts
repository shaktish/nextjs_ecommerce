/**
 * Shared server-side HTTP client used by:
 * - Server Components
 * - Server Actions
 * - BFF Route Handlers
 *
 * Authentication flow:
 *
 * Client Component
 *       │
 *       ▼
 *   bffFetch()
 *       │
 *       ▼
 * BFF Route Handler
 *       │
 *       ▼
 *  backendClient()
 *       │
 *   access token expired?
 *       │
 *    Yes▼                 No──────────────► Return response
 * refresh access token
 *       │
 *       ▼
 * Retry original request
 *       │
 *       ▼
 * Return response
 *
 * If the refresh token has expired:
 * - backendClient throws RefreshTokenExpiredError
 * - Server Components redirect to /auth/login
 * - Server Actions redirect to /auth/login
 * - BFF returns 401 { code: "AUTH_EXPIRED" }
 * - bffFetch clears the auth store and redirects to /auth/login
 *
 * Responsibilities:
 * - Forward authentication cookies.
 * - Refresh expired access tokens.
 * - Retry the original request once.
 * - Return any Set-Cookie headers from the backend.
 *
 * Public endpoints (e.g. login) can opt out of authentication by
 * passing `skipAuth: true`, which skips both cookie forwarding and
 * token refresh.
 */

// backendClient → transport + refresh + retry

import { cookies } from "next/headers";
import { refreshAccessToken } from "./refresh";
import getRefreshPromise from "./refreshLocker";

type BackendClientResponse = {
  response: Response;
  setCookies: string[];
};
export async function backendClient(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {},
): Promise<BackendClientResponse> {
  const cookieStore = await cookies();
  const url = `${process.env.API_URL}${path}`;
  console.log(url, "url - backend client");

  /**
   * Executes the HTTP request with the provided Cookie header.
   * Used for both the initial request and the retry after a
   * successful token refresh.
   */
  async function execute(cookieHeader: string) {
    const headers = new Headers(options.headers);

    headers.delete("accept-encoding");
    headers.delete("host");
    headers.delete("content-length");
    headers.set("Cookie", cookieHeader);
    return fetch(url, {
      ...options,
      headers,
    });
  }

  // Execute the original request using the current browser cookies.
  const cookieHeader = options.skipAuth ? "" : cookieStore.toString();

  let response = await execute(cookieHeader);
  // Capture any cookies returned by the backend so the caller
  // can propagate them to the browser if necessary.
  let setCookies = response.headers.getSetCookie();
  if (options.skipAuth || response.status !== 401) {
    console.log("backendClient");
    return { response, setCookies };
  }
  console.log("401 - gonna get refresh token");
  // Access token has expired. Refresh it once and retry
  // the original request using the updated cookies.
  try {
    // Retry the original request using the refreshed cookies.
    const refreshResult = await getRefreshPromise(refreshAccessToken);
    console.log("token refreshed");

    // Retry once
    response = await execute(refreshResult.cookieHeader);
    setCookies = refreshResult.setCookies;

    return { response, setCookies };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
