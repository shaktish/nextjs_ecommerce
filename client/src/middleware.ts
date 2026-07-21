import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const adminRoutes = ["/admin"];
const protectedRoutes = [
  ...adminRoutes,
  "/account",
  "/checkout",
  "/orders",
  "/cart",
];

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
type JwtPayload = {
  role: "Admin" | "User";
};

export async function middleware(request: NextRequest) {
  console.log("Middleware START");
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. Public routes
  if (!isProtected) {
    return NextResponse.next();
  }

  // 2. Must have refresh token
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. No access token? backendClient will refresh.
  if (!accessToken) {
    return NextResponse.next();
  }

  // 4. Only admin pages need role verification
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // verify token to get role
  try {
    const { payload } = await jwtVerify(accessToken, JWT_SECRET);
    const { role } = payload as JwtPayload;

    if (role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.debug("Access token invalid or expired.");
    }
    // fall through to refresh flow
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
