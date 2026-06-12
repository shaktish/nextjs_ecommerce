async function getProductLookup() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/lookup`,
    {
      next: {
        revalidate: 36000,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Error fetching product lookup");
  }

  return response.json();
}

async function getProduct(id: string) {
  //   await new Promise((r) => setTimeout(r, 5000));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
    {
      next: {
        revalidate: 86400, // 5mins
        tags: [`product-${id}`],
      },
    },
  );

  if (!response.ok) {
    throw new Error("Error fetching product details");
  }

  return response.json();
}

export { getProductLookup, getProduct };
