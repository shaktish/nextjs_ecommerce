import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CouponState } from "./types";

interface CouponCardProps {
  couponInput: string;
  couponState: CouponState;
  setCouponInput: Dispatch<SetStateAction<string>>;
  couponHandler: () => void;
  removeCouponHandler: () => void;
}

function CouponCard({
  couponInput,
  couponState,
  setCouponInput,
  couponHandler,
  removeCouponHandler,
}: CouponCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (couponState.valid && inputRef.current) {
      inputRef.current.blur();
    }
  }, [couponState.valid]);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Coupon</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Have a discount code? Apply it below.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          couponHandler();
        }}
      >
        <Input
          ref={inputRef}
          type="text"
          value={couponInput}
          placeholder="Enter coupon code"
          onChange={(e) => setCouponInput(e.target.value)}
          className="mb-4 w-full"
          disabled={couponState.valid}
        />

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={
              !couponInput.trim() || couponState.loading || couponState.valid
            }
          >
            {couponState.loading ? "Applying..." : "Apply"}
          </Button>

          {couponState.valid && (
            <Button
              type="button"
              variant="outline"
              onClick={removeCouponHandler}
            >
              Remove
            </Button>
          )}
          {couponState.message && (
            <p
              className={` text-sm font-medium ${
                couponState.valid ? "text-green-600" : "text-destructive"
              }`}
            >
              {couponState.valid
                ? `${couponState.percentage}% off — ${couponState.message}`
                : couponState.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default CouponCard;
