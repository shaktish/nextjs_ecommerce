import bffFetch from "@/lib/bffClient";

export async function getOrderById(orderId: string) {
  const response = await bffFetch(`/order/${orderId}`);

  if (!response.ok) {
    throw new Error("Failed to get the order");
  }
  return response.json();
}
