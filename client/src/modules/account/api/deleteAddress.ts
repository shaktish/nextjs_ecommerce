"use server";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";

async function deleteAddress({ id }: { id: string }) {
  const response = await withServerActionAuth(`/api/address/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error deleting address");
  }
  return response.json();
}

export default deleteAddress;
