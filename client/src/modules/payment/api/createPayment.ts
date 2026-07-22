"use server";
import { backendClient } from "@/lib/backend/client";

export async function createPayment(orderId: string) {
  const { response } = await backendClient(`/api/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create the order");
  }
  return response.json();
}
