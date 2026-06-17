import { Prisma } from "@prisma/client";

export const updateProductPriceRange = async (
  productId: string,
  tx: Prisma.TransactionClient,
) => {
  const variants = await tx.productVariant.findMany({
    where: {
      productId,
      isActive: true,
    },
    select: {
      price: true,
    },
  });

  if (!variants.length) {
    // No active variants → reset
    await tx.product.update({
      where: { id: productId },
      data: {
        minPrice: 0,
        maxPrice: 0,
      },
    });
    return;
  }

  const prices = variants.map((v: any) => v.price);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  await tx.product.update({
    where: { id: productId },
    data: {
      minPrice,
      maxPrice,
    },
  });
};

export const invalidateProductCache = async (slug: string): Promise<void> => {
  const response = await fetch(
    `${process.env.API_URL}/api/revalidate-product`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
      },
      body: JSON.stringify({
        productSlug: slug,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to invalidate cache. Status: ${response.status}`);
  }
};
