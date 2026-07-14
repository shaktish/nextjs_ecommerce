export async function getOrderById(orderId: string) {
  const response = await fetch(`api/order/${orderId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get the order");
  }
  return response.json();
}
