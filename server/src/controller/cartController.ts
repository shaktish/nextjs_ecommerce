import { Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { prisma } from "../server";
import winstonLogger from "../utils/winstonLogger";
import { AuthenticateRequest } from "../middleware/authMiddleware";


const addToCart = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const { variantId, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const updatedCart = await prisma.$transaction(async (tx) => {

            const variant = await tx.productVariant.findUnique({
                where: { id: variantId },
                include: {
                    stock: true,
                    product: { select: { name: true } }
                }
            });

            if (!variant || !variant.isActive) {
                throw new Error("VARIANT_NOT_FOUND");
            }

            const availableStock = variant.stock?.quantity || 0;

            if (quantity > availableStock) {
                throw new Error("INSUFFICIENT_STOCK");
            }

            const cart = await tx.cart.upsert({
                where: { userId },
                update: {},
                create: { userId },
            });

            const existingItem = await tx.cartItem.findUnique({
                where: {
                    cartId_variantId: {
                        cartId: cart.id,
                        variantId,
                    },
                },
            });

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;

                if (newQuantity > availableStock) {
                    throw new Error("EXCEEDS_STOCK");
                }

                await tx.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: newQuantity },
                });
            } else {
                await tx.cartItem.create({
                    data: {
                        cartId: cart.id,
                        variantId,
                        quantity,
                        price: variant.price,
                    },
                });
            }

            return await tx.cart.findUnique({
                where: { id: cart.id },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                    stock: true,
                                    size: true,
                                },
                            },
                        },
                    },
                },
            });
        });

        return res.status(200).json({
            message: "Item added to cart",
            cart: updatedCart,
        });

    } catch (e: any) {

        if (e.message === "VARIANT_NOT_FOUND") {
            return res.status(404).json({ message: "Variant not found" });
        }

        if (e.message === "INSUFFICIENT_STOCK") {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        if (e.message === "EXCEEDS_STOCK") {
            return res.status(400).json({ message: "Exceeds stock limit" });
        }

        return res.status(500).json({ message: "Something went wrong" });
    }
});

const getCart = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;

    const cart = await prisma.cart.findUnique({
        where: { userId },
        select: {
            id: true,
            items: {
                select: {
                    id: true,
                    quantity: true,
                    price: true, // snapshot

                    variant: {
                        select: {
                            id: true,
                            size: {
                                select: { name: true },
                            },
                            price: true,
                            stock: {
                                select: { quantity: true },
                            },
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: {
                                        take: 1,
                                        select: { url: true },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    res.status(200).json(cart);
})

const deleteCartItem = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const { cartItemId } = req.params;
    const userId = req.user?.id;

    const deleted = await prisma.cartItem.deleteMany({
        where: {
            id: cartItemId,
            cart: {
                userId,
            },
        },
    });
    if (deleted.count === 0) {
        return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ success: true, message: "Item removed from cart", })
})

const clearEntireCart = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;

    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true
        }
    })

    if (!cart) {
        return res.status(200).json({ success: true, message: "Cart already empty" });
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });

    res.status(200).json({ success: true, message: "Cart cleared" });

});

const updateCartItemQuantity = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const { cartItemId, quantity } = req.body;
    const userId = req.user?.id;

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    const cartItem = await prisma.cartItem.findFirst({
        where: {
            id: cartItemId,
            cart: {
                userId,
            },
        },
        include: {
            variant: {
                include: {
                    stock: {
                        select: {
                            quantity: true
                        }
                    }
                }
            }
        }

    })

    if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
    }

    const availableStock = cartItem.variant.stock?.quantity || 0;
    winstonLogger.info('availableStock', availableStock);

    if (qty > availableStock) {
        return res.status(400).json({
            message: `Only ${availableStock} items available`,
        });
    }

    await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: qty },
    });


    res.status(200).json({
        success: true,
        data: {
            id: cartItemId,
            quantity: qty,
            unitPrice: cartItem.price,
            totalPrice: cartItem.price * qty,
        }
    })
});


export {
    addToCart,
    getCart,
    deleteCartItem,
    clearEntireCart,
    updateCartItemQuantity
}