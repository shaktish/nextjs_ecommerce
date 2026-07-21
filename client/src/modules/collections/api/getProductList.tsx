import { backendClient } from "@/lib/backend/client";

async function getProductList(queryParams: URLSearchParams) {
  const { response } = await backendClient(
    `/api/product/get-products?${queryParams.toString()}`,
    {
      next: {
        revalidate: 3600,
        tags: ["products"],
      },
    },
  );

  if (!response.ok) {
    throw new Error("Error fetching product list");
  }
  return response.json();
}

export default getProductList;
