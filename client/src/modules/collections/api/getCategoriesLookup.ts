"use server";
import withServerComponentAuth from "@/lib/auth/withServerComponentAuth";
import { backendClient } from "@/lib/backend/client";

async function getCategoriesLookup() {
  return withServerComponentAuth(async () => {
    const { response } = await backendClient("/api/product/lookup-categories");
    return response.json();
  });
}

export default getCategoriesLookup;
