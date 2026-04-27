"use client";
import { Button } from "@/components/ui/button";

import { useProductStore } from "@/store/useProductStore";
import { formatPrice } from "@/utils/number";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ProductDetails({}) {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const productId = params.id as string;
  const { isLoading, getProduct, product, productLookup, getLookup } =
    useProductStore();

  useEffect(() => {
    getLookup();
  }, []);

  useEffect(() => {
    console.log("Fetching product details for id:", productId);
    getProduct(productId);
  }, [getProduct, productId]);

  useEffect(() => {
    if (!product?.variants?.length) return;

    const firstAvailable =
      product.variants.find((v) => v.stock > 0) || product.variants[0];

    setSelectedSize(firstAvailable.sizeId);
    setPrice(firstAvailable.price);
    setStock(firstAvailable.stock || 0);
  }, [product]);

  const handleSize = (sizeId: string, price: number, stock: number) => {
    setQuantity(1);
    setSelectedSize(sizeId);
    setPrice(price);
    setStock(stock || 0);
  };

  const quantityHandler = (value: number, type: string) => {
    if (quantity + value < 1) return;
    if (value === -1 && type === "decrement") {
      setQuantity((prev) => prev - 1);
    } else if (value === 1 && type === "increment" && quantity < stock) {
      setQuantity((prev) => prev + 1);
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
                className="aspect-square overflow-hidden rounded-lg"
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

          {/* Right: Product Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>
            <p className="text-lg text-gray-700 mb-6">{product?.description}</p>
            <p className="mb-4">
              <strong className="text-xl">{formatPrice(price)} </strong> MRP
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
                      onClick={() =>
                        handleSize(
                          variant.sizeId,
                          variant.price,
                          variant.stock || 0,
                        )
                      }
                      // className={`border-2 ${selectedSize === variant.sizeId ? "border-[#FB923C]" : ""}`}
                      className={`border-2 text-black ${
                        selectedSize === variant.sizeId
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
              {stock > 0 ? `${stock} items left` : "Out of stock"}
            </p>
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
            <Button
              disabled={stock === 0}
              className="bg-[#ff6568] hover:bg-[#000000] cursor-pointer text-white px-6 py-3 rounded-lg mt-6 lg:width-auto"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
