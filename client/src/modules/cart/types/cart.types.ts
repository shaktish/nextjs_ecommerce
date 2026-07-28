export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  size: string;
  variantId: string;
  stock: number;
}

export interface CartResponse {
  items: CartItem[];
  cartId: string;
  subtotal: number;
}
