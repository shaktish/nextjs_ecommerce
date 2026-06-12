"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ProductLookup, Variant } from "@/types/product.types";
import { formatPrice } from "@/utils/number";

import useProductAction from "../hooks/useProductAction";

interface ProductActions {
  variants: Variant[];
  productLookup: ProductLookup;
}
function ProductActions({ variants, productLookup }: ProductActions) {
  const {
    selectedVariant,
    quantity,
    addToCartHandler,
    cartLoader,
    decrementQuantity,
    incrementQuantity,
    handleSize,
    sizeMap,
    remainingStock,
    isCartMaxReached,
    isUserLoggedIn,
  } = useProductAction({ variants, productLookup });

  return (
    <>
      <p className="mb-4">
        <strong className="text-xl mr-1.5">
          {formatPrice(selectedVariant.price)}
        </strong>
        MRP
      </p>
      <div className="flex flex-wrap gap-4 mb-4">
        {variants.map((variant) => {
          return (
            <div key={variant.id} className="flex items-center gap-4">
              <Button
                type="button"
                variant={"outline"}
                key={variant.sizeId}
                size="sm"
                onClick={() => handleSize(variant)}
                className={`border-2 ${
                  selectedVariant?.sizeId === variant.sizeId
                    ? "border-primary !bg-accent  text-accent-foreground"
                    : "border-border"
                }`}
              >
                {sizeMap.get(variant.sizeId)}
              </Button>
            </div>
          );
        })}
      </div>

      {isUserLoggedIn && (
        <>
          {selectedVariant.stock > 0 && (
            <div>
              <p>Quantity</p>
              <div className="flex gap-5 mt-2 items-center">
                <Button
                  variant={"outline"}
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <p>{quantity}</p>
                <Button
                  variant={"outline"}
                  onClick={incrementQuantity}
                  disabled={quantity >= remainingStock}
                >
                  +
                </Button>
              </div>
            </div>
          )}

          <Button
            disabled={
              selectedVariant.stock === 0 || isCartMaxReached || cartLoader
            }
            className="bg-[#ff6568] hover:bg-[#000000] cursor-pointer text-white px-6 py-3 rounded-lg mt-6 lg:width-auto"
            onClick={() => addToCartHandler(selectedVariant.id || "", quantity)}
          >
            {cartLoader ? <Spinner /> : "Add to cart"}
          </Button>
          {isCartMaxReached && (
            <p className="text-red-500 text-sm mt-2">
              Maximum available stock already added to cart
            </p>
          )}
        </>
      )}
    </>
  );
}

export default ProductActions;
