import { CouponState } from "./types";

interface TotalCardProps {
  couponState: CouponState;
  discountAmount: number;
  total: number;
  subtotal: number;
}

function TotalCard({
  subtotal,
  couponState,
  discountAmount,
  total,
}: TotalCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">{subtotal}</span>
      </div>

      {couponState.valid && (
        <div className="flex items-center justify-between">
          <span className="text-green-600">
            Discount ({couponState.percentage}%)
          </span>
          <span className="font-medium text-green-600">{discountAmount}</span>
        </div>
      )}

      <div className="border-t pt-3">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
}

export default TotalCard;
