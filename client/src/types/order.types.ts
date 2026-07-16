export type OrderItem = {
  name: string;
  slug: string;
  category: string;
  imageUrl: string;
  price: string;
};

export type Order = {
  id: string;
  createdAt: string;
  total: string;
  shippingName: string;
  items: OrderItem[];
  imageUrl: string;
};
