export async function createPayment(orderId: string) {
  const response = await fetch(`api/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create the order");
  }
  return response.json();
}
