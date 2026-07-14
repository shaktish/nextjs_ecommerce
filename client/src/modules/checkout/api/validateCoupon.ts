async function validateCoupon(code: string) {
  const response = await fetch(
    `/api/coupon/validate/${encodeURIComponent(code)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return response.json();
}

export default validateCoupon;
