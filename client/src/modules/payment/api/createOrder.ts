"use server";
import { backendClient } from "@/lib/backend/client";

export async function createOrder(data: {
  addressId: string;
  couponCode?: string;
}) {
  const { response } = await backendClient(`/api/payment/createOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create the order");
  }
  return response.json();
}
