import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { ProductLookup, Variant } from "@/types/product.types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface UseProductAction {
  variants: Variant[];
  productLookup: ProductLookup;
}

const useProductAction = ({ variants, productLookup }: UseProductAction) => {
  const { user } = useAuthStore();
  const {
    addToCart,
    isLoading: cartLoader,
    error: cartError,
    items: cartItems,
    updateCartItemQuantity,
  } = useCartStore();

  const isUserLoggedIn: boolean = user?.id ? true : false;

  const defaultVariant = useMemo(
    () => variants.find((v) => v.stock > 0) || variants[0],
    [variants],
  );
  const [selectedVariant, setSelectedVariant] =
    useState<Variant>(defaultVariant);

  const [quantity, setQuantity] = useState(1);
  const selectedInCart = useMemo(() => {
    return cartItems.find((item) => item.variantId === selectedVariant.id);
  }, [cartItems, selectedVariant.id]);

  const cartQuantity = selectedInCart?.quantity || 0;
  const remainingStock = selectedVariant.stock - cartQuantity;
  const isCartMaxReached = remainingStock <= 0;

  const sizeMap = useMemo(
    () => new Map(productLookup?.size.map((size) => [size.id, size.name])),
    [productLookup?.size],
  );

  useEffect(() => {
    if (cartError) {
      toast.error(cartError);
    }
  }, [cartError]);

  const handleSize = (variant: Variant) => {
    setQuantity(1);
    setSelectedVariant(variant);
  };

  const incrementQuantity = () => {
    if (quantity < remainingStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCartHandler = async (variantId: string, quantity: number) => {
    let result;
    if (selectedInCart) {
      result = await updateCartItemQuantity({
        cartItemId: selectedInCart.id,
        variantId: selectedInCart.variantId,
        quantity: selectedInCart.quantity + quantity,
      });
    } else {
      result = await addToCart({ variantId, quantity });
    }

    if (result) {
      toast.success(`Product ${selectedInCart ? "updated" : "added"} to cart`);
      setQuantity(1);
    }
  };
  return {
    addToCartHandler,
    handleSize,
    incrementQuantity,
    decrementQuantity,
    sizeMap,
    cartLoader,
    selectedVariant,
    quantity,
    remainingStock,
    isCartMaxReached,
    isUserLoggedIn,
  };
};

export default useProductAction;
