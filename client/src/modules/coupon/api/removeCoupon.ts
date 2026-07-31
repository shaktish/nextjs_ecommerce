import bffFetch from "@/lib/bffClient";

async function deleteCoupon(id: string) {
  const response = await bffFetch(`/coupon/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Error deleting coupon");
  }
  return response.json();
}

export default deleteCoupon;
