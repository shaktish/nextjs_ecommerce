"use server";

import { backendClient } from "@/lib/backend/client";

async function validateCoupon(code: string) {
  const { response } = await backendClient(
    `/api/coupon/validate/${encodeURIComponent(code)}`,
    {
      method: "GET",
    },
  );

  return response.json();
}

export default validateCoupon;
