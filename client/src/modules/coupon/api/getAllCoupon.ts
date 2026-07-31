import bffFetch from "@/lib/bffClient";

async function getAllCoupon() {
  const response = await bffFetch(`/coupon`, { method: "GET" });

  if (!response.ok) {
    throw new Error("Error fetching coupon");
  }
  return response.json();
}

export default getAllCoupon;
