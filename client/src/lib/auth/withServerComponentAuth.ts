/**
 * Wrapper for backend requests made from Server Components.
 *
 * Execution flow:
 *
 * Server Component
 *      │
 *      ▼
 * withServerComponentAuth()
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
 * Return response
 * If the refresh token has expired:
 * - backendClient() throws RefreshTokenExpiredError.
 * - Redirects the user to /auth/login.
 *
 * Responsibilities:
 * - Executes the supplied server-side request.
 * - Redirects the user to the login page when backendClient()
 *   throws RefreshTokenExpiredError.
 *
 * Used only in Server Components.
 */

import { RefreshTokenExpiredError } from "@/errors/refreshTokenExpired";
import { redirect } from "next/navigation";

export default async function withServerComponentAuth<T>(
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.log("executeServerRequest error");
    if (e instanceof RefreshTokenExpiredError) {
      redirect("/auth/login");
    }

    throw e;
  }
}
