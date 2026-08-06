import bffFetch from "@/lib/bffClient";
import { AdminOrder, OrderStatus } from "@/types/order.types";

type AdminOrdersResponse = {
  orders: AdminOrder[];
  total: number;
  page: number;
  limit: number;
};

export async function getAdminOrders({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<AdminOrdersResponse> {
  const response = await bffFetch(`/order/admin?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Failed to get orders");
  }

  return response.json();
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const response = await bffFetch(`/order/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to update order status");
  }

  return response.json();
}
