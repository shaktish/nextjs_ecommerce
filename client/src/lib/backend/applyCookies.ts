import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

export async function applyCookies(setCookies: string[]) {
  const cookieStore = await cookies();

  const parsed = setCookieParser.parse(setCookies);

  for (const cookie of parsed) {
    cookieStore.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite?.toLowerCase() as "lax" | "strict" | "none",
      path: cookie.path,
      domain: cookie.domain,
      expires: cookie.expires,
      maxAge: cookie.maxAge,
    });
  }
}
