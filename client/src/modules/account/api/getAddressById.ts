"use server";
import { backendClient } from "@/lib/backend/client";
import { cookies } from "next/headers";

async function getAddressById(id: string) {
  const cookieStore = await cookies();
  const { response } = await backendClient(`/api/address/${id}`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching address");
  }
  return response.json();
}

export default getAddressById;
