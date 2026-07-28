import bffFetch from "@/lib/bffClient";

async function getCartItems() {
  const response = await bffFetch(`/cart`, {
    method: "GET",
  });

  return response.json();
}

export default getCartItems;
