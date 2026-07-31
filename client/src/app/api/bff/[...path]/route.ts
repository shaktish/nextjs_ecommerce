import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "../../../../lib/backend/client";
import { RefreshTokenExpiredError } from "@/errors/refreshTokenExpired";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  return proxy(request, params);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  return proxy(request, params);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return proxy(request, params);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return proxy(request, params);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return proxy(request, params);
}

/**
 * Backend-for-Frontend (BFF) proxy.
 *
 * Why?
 * - Prevents client components from calling the backend directly.
 * - Forwards browser cookies to the backend.
 * - Automatically refreshes expired access tokens via backendClient().
 * - Retries the original request after a successful refresh.
 * - Forwards any Set-Cookie headers returned by the backend
 *   (e.g. refreshed access/refresh tokens) back to the browser.
 */

async function proxy(
  request: NextRequest,
  paramsPromise: RouteContext["params"],
) {
  try {
    const { path } = await paramsPromise;

    const backendPath = `/api/${path.join("/")}${request.nextUrl.search}`;

    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : undefined;

    const { response, setCookies } = await backendClient(backendPath, {
      method: request.method,
      headers: request.headers,
      body: body,
    });

    // Remove hop-by-hop headers before streaming the response
    // back to the browser.
    const headers = new Headers(response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");
    headers.delete("transfer-encoding");

    const nextResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    // Forward any cookies returned by the backend
    setCookies?.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (e) {
    if (e instanceof RefreshTokenExpiredError) {
      return NextResponse.json(
        { message: "Refresh token expired", code: "AUTH_EXPIRED" },
        { status: 401 },
      );
    }

    throw e;
  }
}
