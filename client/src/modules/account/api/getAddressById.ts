"use server";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";

async function getAddressById(id: string) {
  const response = await withServerActionAuth(`/api/address/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error fetching address");
  }
  return response.json();
}

export default getAddressById;
