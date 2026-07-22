"use server";
import { backendClient } from "@/lib/backend/client";

export async function verifyPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpay_signature: string;
}) {
  const { response } = await backendClient(`/api/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Payment verification failed");
  }
  return response.json();
}
