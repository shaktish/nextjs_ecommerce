/**
 * Wrapper for backend requests made from Server Actions.
 *
 * Execution flow:
 *
 * Server Action
 *      │
 *      ▼
 * withServerActionAuth()
 *      │
 *      ▼
 * backendClient()
 *      │
 * access token expired?
 *      │
 *   Yes▼                 No──────────────► Return response
 * refresh access token
 *      │
 *      ▼
 * Retry original request
 *      │
 *      ▼
 * Apply Set-Cookie headers
 *      │
 *      ▼
 * Return response
 * Responsibilities:
 * - Calls backendClient() to execute the request.
 * - Synchronizes any Set-Cookie headers returned by the backend
 *   with the browser's cookie store.
 * - Redirects the user to the login page when the refresh token
 *   has expired.
 *
 * Used only in Server Actions.
 */

import { RefreshTokenExpiredError } from "@/errors/refreshTokenExpired";
import { applyCookies } from "../backend/applyCookies";
import { backendClient } from "../backend/client";
import { redirect } from "next/navigation";

export async function withServerActionAuth(
  path: string,
  options: RequestInit & {
    skipAuth?: boolean;
  } = {},
) {
  try {
    const result = await backendClient(path, options);
    // Synchronize any cookies returned by the backend (login or refresh)
    // with the browser's cookie store.
    await applyCookies(result.setCookies);
    return result.response;
  } catch (e) {
    if (e instanceof RefreshTokenExpiredError) {
      redirect("/auth/login");
    }
    throw e;
  }
}
