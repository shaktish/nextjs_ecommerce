import { PrismaClient } from "@prisma/client";
import { CreateVariantDTO } from "../types/productTypes";

export const updateProductPriceRange = async (
  productId: string,
  tx = PrismaClient,
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

  const prices = variants.map((v: CreateVariantDTO) => v.price);

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

export const invalidateCache = async (
  data: Record<string, string>,
  url: string,
) => {
  await fetch(`${process.env.NEXT_APP_URL}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
    },
    body: JSON.stringify(data),
  });
};
