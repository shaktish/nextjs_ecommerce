import { cookies } from "next/headers";
import { refreshAccessToken } from "./refresh";
import getRefreshPromise from "./refreshLocker";

type BackendClientResponse = {
  response: Response;
  setCookies: string[];
};

export async function backendClient(
  path: string,
  options: RequestInit = {},
): Promise<BackendClientResponse> {
  const cookieStore = await cookies();
  const url = `${process.env.API_URL}${path}`;
  console.log(url, "url - backend client");
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

  // First request
  let response = await execute(cookieStore.toString());

  if (response.status !== 401) {
    return { response, setCookies: [] };
  }
  console.log("401 - gonna get refresh token");

  // Refresh
  const { cookieHeader, setCookies } =
    await getRefreshPromise(refreshAccessToken);
  console.log("token refreshed");

  // Retry once
  response = await execute(cookieHeader);
  if (response.status === 401) {
    throw new Error();
  }

  return { response, setCookies };
}
