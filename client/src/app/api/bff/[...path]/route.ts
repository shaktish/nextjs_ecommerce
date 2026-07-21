// app/api/bff/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "../../../../lib/backend/client";

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

async function proxy(
  request: NextRequest,
  paramsPromise: RouteContext["params"],
) {
  const { path } = await paramsPromise;

  const backendPath = `/api/${path.join("/")}${request.nextUrl.search}`;
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();
  const { response, setCookies } = await backendClient(backendPath, {
    method: request.method,
    headers: request.headers,
    body: body,
  });

  const nextResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  setCookies?.forEach((cookie) => {
    nextResponse.headers.append("Set-Cookie", cookie);
  });

  return nextResponse;
}
