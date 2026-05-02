"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCartStore } from "@/store/useCartStore";

import { useProductStore } from "@/store/useProductStore";
import { Variant } from "@/types/product.types";
import { formatPrice } from "@/utils/number";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function ProductDetails({}) {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant>();
  const productId = params.id as string;
  const { isLoading, getProduct, product, productLookup, getLookup } =
    useProductStore();
  const { addToCart, isLoading: cartLoader, error: cartError } = useCartStore();

  useEffect(() => {
    getLookup();
  }, []);

  useEffect(() => {
    if (cartError) {
      toast.error(cartError);
    }
  }, [cartError]);

  useEffect(() => {
    getProduct(productId);
  }, [getProduct, productId]);

  useEffect(() => {
    if (!product?.variants?.length) return;

    const firstAvailable =
      product.variants.find((v) => v.stock > 0) || product.variants[0];
    setSelectedVariant(firstAvailable);
  }, [product]);

  const handleSize = (variant: Variant) => {
    setQuantity(1);
    setSelectedVariant(variant);
  };

  const quantityHandler = (value: number, type: string) => {
    if (quantity + value < 1) return;
    if (value === -1 && type === "decrement") {
      setQuantity((prev) => prev - 1);
    } else if (
      selectedVariant &&
      value === 1 &&
      type === "increment" &&
      quantity < selectedVariant.stock
    ) {
      setQuantity((prev) => prev + 1);
    }
  };

  const addToCartHandler = async (variantId: string, quantity: number) => {
    const result = await addToCart({ variantId, quantity });

    if (result) {
      toast.success("Product added to cart");
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Images */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {product?.images?.map((image) => (
              <div
                className="aspect-[3/4] overflow-hidden rounded-lg"
                key={image.id}
              >
                <img
                  src={image.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>
            <p className="text-lg text-gray-700 mb-6">{product?.description}</p>
            <p className="mb-4">
              <strong className="text-xl">
                {selectedVariant?.price && formatPrice(selectedVariant?.price)}
              </strong>{" "}
              MRP
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              {product?.variants.map((variant) => {
                const size = productLookup?.size?.find(
                  (s) => s.id === variant.sizeId,
                );
                return (
                  <div key={variant.id} className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant={"outline"}
                      key={variant.sizeId}
                      size="sm"
                      onClick={() => handleSize(variant)}
                      className={`border-2 text-black ${
                        selectedVariant?.sizeId === variant.sizeId
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-200"
                      }`}
                    >
                      {size?.name}
                    </Button>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">
              {selectedVariant &&
                selectedVariant?.stock <= 3 &&
                `${selectedVariant?.stock} item left`}
              {selectedVariant &&
                selectedVariant?.stock === 0 &&
                "Out of stock"}
            </p>
            {selectedVariant && selectedVariant?.stock > 0 && (
              <div>
                <p>Quantity</p>
                <div className="flex gap-5 mt-2 items-center">
                  <Button
                    variant={"outline"}
                    onClick={() => quantityHandler(-1, "decrement")}
                  >
                    -
                  </Button>
                  <p>{quantity}</p>
                  <Button
                    variant={"outline"}
                    onClick={() => quantityHandler(1, "increment")}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            <Button
              disabled={selectedVariant?.stock === 0 || cartLoader}
              className="bg-[#ff6568] hover:bg-[#000000] cursor-pointer text-white px-6 py-3 rounded-lg mt-6 lg:width-auto"
              onClick={() =>
                addToCartHandler(
                  (selectedVariant && selectedVariant?.id) || "",
                  quantity,
                )
              }
            >
              {cartLoader ? <Spinner /> : "Add to cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
