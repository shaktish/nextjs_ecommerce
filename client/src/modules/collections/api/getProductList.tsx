async function getProductList(queryParams: URLSearchParams) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch(
    `${process.env.API_URL}/api/product/get-products?${queryParams.toString()}`,
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
