import { PrismaClient } from "@prisma/client";


export const updateProductPriceRange = async (
    productId: string,
    tx = PrismaClient
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

    const prices = variants.map((v) => v.price);

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