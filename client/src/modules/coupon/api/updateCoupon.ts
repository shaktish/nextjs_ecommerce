"use server";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";
import { Coupon, CouponImmutableFields } from "../types/coupon.types";

async function updateCoupon(
  id: string,
  coupon: Omit<Coupon, CouponImmutableFields>,
) {
  const response = await withServerActionAuth(`/api/coupon/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coupon),
  });
  console.log(response, "response");

  return response.json();
}

export default updateCoupon;
