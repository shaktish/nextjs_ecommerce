/**
 * If the request body is a ReadableStream (e.g. multipart/form-data),
 * it cannot be replayed after it has been consumed by fetch().
 *
 * To avoid retrying an upload, proactively refresh the access token
 * before sending the request when the current token is expired or
 * about to expire.
 */

import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import getRefreshPromise from "./refreshLocker";
import { refreshAccessToken } from "./refresh";

function isAccessTokenExpiring(token: string, bufferSeconds = 30) {
  try {
    const { exp } = decodeJwt(token);

    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);

    // Refresh slightly before expiry to avoid race conditions.
    return exp <= now + bufferSeconds;
  } catch {
    // Treat invalid tokens as expired.
    return true;
  }
}

async function refreshBeforeStreamingRequest(
  options: RequestInit & { skipAuth?: boolean } = {},
) {
  // Requests with streaming bodies (multipart uploads) cannot be retried.
  // Detect them so we can refresh the token before the upload starts.
  const cookieStore = await cookies();
  const isStreamingRequest =
    options.body != null && options.body instanceof ReadableStream;
  let cookieHeader = options.skipAuth ? "" : cookieStore.toString();
  const accessToken = options.skipAuth
    ? undefined
    : cookieStore.get("accessToken")?.value;
  let setCookies;

  // For streamed requests, refresh the access token before sending
  // the request if it is expired (or about to expire). Unlike JSON
  // requests, multipart uploads cannot be retried because the request
  // body is consumed after the first fetch().

  if (isStreamingRequest && accessToken && isAccessTokenExpiring(accessToken)) {
    const refreshResult = await getRefreshPromise(refreshAccessToken);
    cookieHeader = refreshResult.cookieHeader;
    setCookies = refreshResult.setCookies;
  }

  return { cookieHeader, setCookies, isStreamingRequest };
}

export { isAccessTokenExpiring, refreshBeforeStreamingRequest };
