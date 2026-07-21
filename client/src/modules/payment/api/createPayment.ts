import bffFetch from "@/lib/bffClient";

export async function createPayment(orderId: string) {
  const response = await bffFetch(`/payment`, {
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
