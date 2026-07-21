import { cookies } from "next/headers";

export type RefreshResult = {
  cookieHeader: string;
  setCookies: string[];
};

export async function refreshAccessToken(): Promise<RefreshResult> {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  const response = await fetch(`${process.env.API_URL}/api/auth/refreshToken`, {
    method: "POST",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!response.ok) {
    throw new Error("Refresh token expired");
  }

  const setCookies = response.headers.getSetCookie();

  let cookieHeader = "";

  for (const cookie of setCookies) {
    cookieHeader += cookie.split(";")[0] + "; ";
  }

  return {
    cookieHeader: cookieHeader.trim(),
    setCookies,
  };
}
