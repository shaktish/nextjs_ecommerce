"use client";

import { Address } from "@/types/address.types";
import { useEffect, useMemo, useState } from "react";
import AddressCard from "./AddressCard";
import { useCartStore } from "@/store/useCartStore";
import OrderSummary from "./OrderSummary";
import { Button } from "@/components/ui/button";
import CouponCard from "./CouponCard";
import validateCoupon from "./api/validateCoupon";
import { Separator } from "@/components/ui/separator";
import { CouponState } from "./types";
import TotalCard from "./TotalCard";
import { toast } from "sonner";
import { createOrder } from "../payment/api/createOrder";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface CheckoutContentProps {
  data: Address[];
}

function CheckoutContent({ data }: CheckoutContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [couponState, setCouponState] = useState<CouponState>({
    message: "",
    valid: false,
    percentage: 0,
    loading: false,
  });
  const [couponInput, setCouponInput] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const { items: cartItems } = useCartStore();

  useEffect(() => {
    setSelectedAddress(data.find((item) => item.isDefault)?.id ?? null);
  }, [data]);

  const couponHandler = async () => {
    if (couponInput) {
      setCouponState((prev) => {
        return {
          ...prev,
          loading: true,
        };
      });
      const res = await validateCoupon(couponInput);
      setCouponState({
        loading: false,
        message: res.message,
        percentage: res.percentage,
        valid: res.success,
      });
    }
  };

  const removeCouponHandler = () => {
    setCouponInput("");
    setCouponState({
      message: "",
      valid: false,
      percentage: 0,
      loading: false,
    });
  };
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  }, [cartItems]);
  const discountAmount = Math.round(
    (subtotal * (couponState?.percentage ?? 0)) / 100,
  );
  const total = subtotal - discountAmount;

  const createOrderHandler = async () => {
    if (selectedAddress) {
      const data: { addressId: string; couponCode?: string } = {
        addressId: selectedAddress,
      };
      if (couponState.valid) {
        data.couponCode = couponInput;
      }
      try {
        const res = await createOrder(data);
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        router.push(`/payment?orderId=${res.orderId}`);
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message);
        } else {
          toast.error("something went wrong");
        }
      }
    }
  };
  console.log(selectedAddress);
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[70%] space-y-6">
          <AddressCard
            data={data}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[70%] space-y-6">
              <CouponCard
                couponState={couponState}
                couponHandler={couponHandler}
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                removeCouponHandler={removeCouponHandler}
              />
            </div>

            <div className="w-full lg:w-[30%] space-y-6">
              <Button
                onClick={() => createOrderHandler()}
                disabled={!selectedAddress}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[30%]">
          <div className="space-y-5">
            <div className="rounded-xl border bg-card p-5 shadow-sm mb-5">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <OrderSummary cartItems={cartItems} />
              <Separator className="mt-5 mb-5" />
              <TotalCard
                couponState={couponState}
                discountAmount={discountAmount}
                subtotal={subtotal}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContent;
