"use server";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";

export async function createPayment(orderId: string) {
  const response = await withServerActionAuth(`/api/payment`, {
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
