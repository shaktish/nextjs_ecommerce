"use server";
import { withServerActionAuth } from "@/lib/auth/withServerActionAuth";
import { Coupon, CouponImmutableFields } from "../types/coupon.types";

async function addCoupon(coupon: Omit<Coupon, CouponImmutableFields>) {
  const response = await withServerActionAuth(`/api/coupon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coupon),
  });
  console.log(response, "response");

  return response.json();
}

export default addCoupon;
