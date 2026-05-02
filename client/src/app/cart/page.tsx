"use client";

import { CartItem, useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/utils/number";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { Car } from "lucide-react";
import { useRouter } from "next/navigation";

function Cart() {
  const {
    items,
    getCartItems,
    deleteCartItem,
    isLoading,
    updateCartItemQuantity,
  } = useCartStore();

  const router = useRouter();

  useEffect(() => {
    getCartItems();
  }, []);

  console.log(items, "items");

  const quantityHandler = async (
    value: number,
    type: string,
    item: CartItem,
  ) => {
    if (type === "increment" && item.quantity >= item.stock) {
      toast.error(`Only ${item.stock} available`);
      return;
    }

    const updatedQuantity =
      type === "increment" ? item.quantity + value : item.quantity - value;
    const result = await updateCartItemQuantity({
      cartItemId: item.id,
      variantId: item.variantId,
      quantity: updatedQuantity,
    });
    // getCartItems();
    console.log(result, "result");
    if (!result.success) {
      toast.error(result.message || "Stock limit reached");
    }
  };

  const removeFromCartHandler = async (id: string) => {
    const result = await deleteCartItem(id);
    if (result) {
      toast.success("Item removed from cart");
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <p className="text-gray-600">
            There is nothing in your cart. Let's add some items..
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[70%] space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-lg relative"
                >
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        removeFromCartHandler(item.id);
                      }}
                    >
                      X
                    </Button>
                  </div>

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>

                    <p className="text-gray-600 text-sm">Size: {item.size}</p>

                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity}
                    </p>

                    <div>
                      <p>Quantity</p>
                      <div className="flex gap-5 mt-2 items-center">
                        <Button
                          disabled={isLoading || item.quantity <= 1}
                          variant={"outline"}
                          onClick={() => quantityHandler(1, "decrement", item)}
                        >
                          -
                        </Button>
                        <p>{item.quantity}</p>
                        <Button
                          disabled={isLoading || item.quantity >= item.stock}
                          variant={"outline"}
                          onClick={() => quantityHandler(1, "increment", item)}
                        >
                          +
                        </Button>
                        {item.quantity >= item.stock && (
                          <p className="text-sm text-gray-500">
                            Max quantity reached
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-base font-medium mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-[30%] border rounded-lg p-6 h-fit sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="flex justify-between mb-2">
                <span>Total MRP</span>
                <span>
                  {formatPrice(
                    items.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0,
                    ),
                  )}
                </span>
              </div>

              <Button
                className="w-full mt-4"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>
              <Button
                className="w-full mt-4"
                variant={"outline"}
                onClick={() => router.push("/collections")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
