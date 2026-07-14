export async function verifyPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpay_signature: string;
}) {
  const response = await fetch(`api/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create the order");
  }
  return response;
}
