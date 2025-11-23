import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/auth/login", "/auth/register"];
const adminRoutes = ["/admin"];
const userRoutes = ["/home"];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function middleware(request: NextRequest) {
    console.log('middleware is running')
    const { pathname } = request.nextUrl;
    if (pathname.startsWith("/api")) return NextResponse.next();

    // 1️⃣ Allow public routes
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    // 2️⃣ No access token → redirect to login
    if (!refreshToken) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (accessToken) {
        // 3️⃣ Verify token
        try {
            const { payload } = await jwtVerify(accessToken, JWT_SECRET);
            const role = (payload as any).role;

            // handle role-based redirects
            if (role === "Admin" && userRoutes.some((r) => pathname.startsWith(r))) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }

            if (role !== "Admin" && adminRoutes.some((r) => pathname.startsWith(r))) {
                return NextResponse.redirect(new URL("/home", request.url));
            }

            return NextResponse.next();
        } catch (e) {
            console.log("Access token expired or invalid.");
        }
    }

    try {
        console.log('going to request accessToken as refreshToken is still valid');
        // IMPORTANT: Must call backend using FULL URL, not "/api"
        const refreshResponse = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/auth/refreshToken`,
            {
                method: "POST",
                headers: {
                    Cookie: request.headers.get("cookie") || "",
                },
            }
        );

        if (refreshResponse.ok) {
            // Grab Set-Cookie headers and return them to browser
            const res = NextResponse.next();
            const setCookies = refreshResponse.headers.getSetCookie();
            setCookies.forEach((cookie) =>
                res.headers.append("set-cookie", cookie)
            );

            console.log("Refresh success — proceeding to page");
            return res;
        }


    } catch (err) {
        console.log("Refresh token request failed:", err);
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
