/**
 * Shared server-side HTTP client used by:
 * - Server Components
 * - Server Actions
 * - BFF Route Handlers
 *
 * Authentication flow:
 *
                Client Component
                           │
                           ▼
                       bffFetch()
                           │
                           ▼
                  BFF Route Handler
                           │
                           ▼
                    backendClient()
                           │
                           ▼
              Is request body a stream?
                  (multipart/form-data)
                     │             │
               Yes   │             │ No
                     ▼             ▼
      Is access token         Send request
      expiring?                    │
           │                       ▼
      Yes  ▼  No               401 response?
 Refresh access token              │
           │                  Yes  ▼  No
           └──────────────┐  Refresh access token
                          │         │
                          ▼         ▼
                    Send request  Retry request once
                          │         │
                          └────┬────┘
                               ▼
                        Return response

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
import { refreshAccessToken } from "./refresh";
import getRefreshPromise from "./refreshLocker";
import { RefreshTokenExpiredError } from "@/errors/refreshTokenExpired";
import execute from "./execute";
import { refreshBeforeStreamingRequest } from "./helper";

type BackendClientResponse = {
  response: Response;
  setCookies: string[];
};
export async function backendClient(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {},
): Promise<BackendClientResponse> {
  // const cookieStore = await cookies();
  const url = `${process.env.API_URL}${path}`;
  console.log(url, "url backend client");

  // For streamed requests, refresh the access token before sending
  // the request if it is expired (or about to expire). Unlike JSON
  // requests, multipart uploads cannot be retried because the request
  // body is consumed after the first fetch().
  let { cookieHeader, setCookies, isStreamingRequest } =
    await refreshBeforeStreamingRequest(options);

  let response = await execute(url, cookieHeader, options);
  // If we already refreshed before the request, preserve those
  // Set-Cookie headers so they can be forwarded back to the browser.
  // Otherwise, return any cookies from the backend response.
  if (!setCookies) {
    setCookies = response.headers.getSetCookie();
  }
  if (options.skipAuth || response.status !== 401) {
    // proceed
    return { response, setCookies };
  }

  // Multipart uploads cannot be replayed after fetch() has consumed
  // the ReadableStream. If we still receive a 401 here (for example,
  // due to token revocation or clock skew), do not retry the request.
  if (isStreamingRequest) {
    throw new RefreshTokenExpiredError(
      "Received 401 for streamed request after pre-refresh check",
    );
  }

  // Access token has expired. Refresh it once and retry
  console.log("401 - gonna get refresh token");
  // Retry the original request using the refreshed cookies.
  const refreshResult = await getRefreshPromise(refreshAccessToken);
  console.log("token refreshed");

  // Retry once
  response = await execute(url, refreshResult.cookieHeader, options);
  if (response.status === 401) {
    throw new RefreshTokenExpiredError(
      "Failed to renew token, even wit valid refresh token",
    );
  }
  setCookies = refreshResult.setCookies;

  return { response, setCookies };
}
