import { CartItem } from "@/store/useCartStore";
import Image from "next/image";
import ProductPreview from "../../../public/images/product-preview.jpeg";
import { formatPrice } from "@/utils/number";

interface OrderSummaryProps {
  cartItems: CartItem[];
}
function OrderSummary({ cartItems }: OrderSummaryProps) {
  return (
    <div className="max-h-[45vh] overflow-y-auto pr-2">
      {cartItems.map((item) => {
        return (
          <div
            className="flex gap-3 border-b pb-4 last:border-b-0"
            key={item.id}
          >
            <Image
              src={item.image || ProductPreview}
              alt={item.name}
              className="object-cover rounded-md"
              width={80}
              height={120}
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>

              <p className="text-sm text-muted-foreground">Size: {item.size}</p>

              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
              <p className="text-base font-medium mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        );
      })}{" "}
    </div>
  );
}

export default OrderSummary;
