async function getProductBySlug(slug: string) {
  //   await new Promise((r) => setTimeout(r, 5000));

  const response = await fetch(`${process.env.API_URL}/api/product/${slug}`, {
    next: {
      tags: [`product-${slug}`],
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching product details");
  }

  return response.json();
}

export default getProductBySlug;
