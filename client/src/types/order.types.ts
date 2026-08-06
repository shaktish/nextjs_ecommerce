export type OrderItem = {
  name: string;
  slug: string;
  category: string;
  imageUrl: string;
  price: number;
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
  total: number;
  shippingName: string;
  items: OrderItem[];
  imageUrl: string;
  status: OrderStatus;
};

export type AdminOrder = Pick<
  Order,
  "id" | "createdAt" | "total" | "shippingName" | "status"
> & {
  customerName: string;
  customerEmail: string;
  itemCount: number;
};
