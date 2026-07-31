/**
 * Executes the HTTP request with the provided Cookie header.
 * Used for both the initial request and the retry after a
 * successful token refresh.
 */

export default async function execute(
  url: string,
  cookieHeader: string,
  options: RequestInit & { skipAuth?: boolean } = {},
) {
  const headers = new Headers(options.headers);

  headers.delete("accept-encoding");
  headers.delete("host");
  headers.delete("content-length");
  headers.set("Cookie", cookieHeader);
  return fetch(url, {
    method: options.method,
    body: options.body,
    signal: options.signal,
    headers,
    ...(options.body ? { duplex: "half" as const } : {}),
  });
}
