import bffFetch from "@/lib/bffClient";

async function getCoupon(id: string) {
  const response = await bffFetch(`/coupon/${id}`, { method: "GET" });

  if (!response.ok) {
    throw new Error("Error fetching coupon");
  }
  return response.json();
}

export default getCoupon;
