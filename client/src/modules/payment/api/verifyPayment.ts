import bffFetch from "@/lib/bffClient";

export async function verifyPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpay_signature: string;
}) {
  const response = await bffFetch(`/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create the order");
  }
  return response;
}
