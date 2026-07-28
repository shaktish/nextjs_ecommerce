"use server";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";

export async function verifyPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpay_signature: string;
}) {
  const response = await withServerActionAuth(`/api/payment/verify`, {
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
