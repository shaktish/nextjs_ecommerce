"use server";
import { backendClient } from "@/lib/backend/client";

async function getProductLookup() {
  const { response } = await backendClient("/api/product/lookup", {
    skipAuth: true,
  });
  return response.json();
}

export default getProductLookup;
