type GetOrdersParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export async function getOrders(params: GetOrdersParams) {
  const query = new URLSearchParams();

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }
  const response = await fetch(`/api/order?${query.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get the orders");
  }
  return response.json();
}
