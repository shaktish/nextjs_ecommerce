export async function createOrder(data: {
  addressId: string;
  couponCode?: string;
}) {
  const response = await fetch(`api/payment/createOrder`, {
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
  return response.json();
}
