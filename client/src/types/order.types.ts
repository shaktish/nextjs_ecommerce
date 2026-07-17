export type OrderItem = {
  name: string;
  slug: string;
  category: string;
  imageUrl: string;
  price: string;
};

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type Order = {
  id: string;
  createdAt: string;
  total: string;
  shippingName: string;
  items: OrderItem[];
  imageUrl: string;
  status: OrderStatus;
};
