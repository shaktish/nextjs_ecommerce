"use server";
import { backendClient } from "@/lib/backend/client";
import { addressSchema } from "@/schemas/addressSchema";
import z from "zod";

type AddressFormData = z.infer<typeof addressSchema>;

async function addAddress(data: AddressFormData) {
  const { response } = await backendClient(`/api/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create address");
  }

  return response.json();
}

export default addAddress;
