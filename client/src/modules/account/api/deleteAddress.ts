"use server";
import { backendClient } from "@/lib/backend/client";

async function deleteAddress({ id }: { id: string }) {
  const { response } = await backendClient(`/api/address/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error deleting address");
  }
  return response.json();
}

export default deleteAddress;
