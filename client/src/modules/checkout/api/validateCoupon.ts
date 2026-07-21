import bffFetch from "@/lib/bffClient";

async function validateCoupon(code: string) {
  const response = await bffFetch(
    `/coupon/validate/${encodeURIComponent(code)}`,
    {
      method: "GET",
    },
  );

  return response.json();
}

export default validateCoupon;
