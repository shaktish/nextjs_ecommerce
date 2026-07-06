import { Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { prisma } from "../server";
import winstonLogger from "../utils/winstonLogger";
import { AuthenticateRequest } from "../middleware/authMiddleware";

const mapCartItem = (item: any) => ({
  id: item.id,
  quantity: item.quantity,
  price: item.price,
  name: item.variant.product.name,
  image: item.variant.product.images[0]?.url,
  size: item.variant.size.name,
  variantId: item.variant.id,
  stock: item.variant.stock.quantity,
});

const getSummaryTotals = (items: any) => {
  const subtotal = items.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0,
    4,
  );
  return subtotal;
};

const addToCart = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
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
            product: { select: { name: true } },
          },
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

        let updatedItem;

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;

          if (newQuantity > availableStock) {
            throw new Error("EXCEEDS_STOCK");
          }

          updatedItem = await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity },
            select: {
              id: true,
              quantity: true,
              price: true,
              variant: {
                select: {
                  id: true,
                  size: { select: { name: true } },
                  stock: { select: { quantity: true } },
                  product: {
                    select: {
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
          });
        } else {
          updatedItem = await tx.cartItem.create({
            data: {
              cartId: cart.id,
              variantId,
              quantity,
              price: variant.price,
            },
            select: {
              id: true,
              quantity: true,
              price: true,
              variant: {
                select: {
                  id: true,
                  size: { select: { name: true } },
                  stock: { select: { quantity: true } },
                  product: {
                    select: {
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
          });
        }
        winstonLogger.info(updatedItem);
        return {
          items: updatedItem,
          cartId: cart.id,
        };
      });

      return res.status(200).json({
        message: "Item added to cart",
        items: mapCartItem(updatedCart.items),
        cartId: updatedCart.cartId,
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
  },
);

const getCart = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    winstonLogger.info("Get Cart Endpoint called");
    const userId = req.user?.id;
    winstonLogger.info(`userId: ${userId}`);
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
                stock: {
                  select: {
                    quantity: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const updatedItems = cart?.items.map((item) => mapCartItem(item));
    winstonLogger.info("updatedItems", updatedItems);

    winstonLogger.info({
      route: req.originalUrl,
      method: req.method,
      cartExists: !!cart,
      cartId: cart?.id,
    });
    return res.status(200).json({
      items: updatedItems,
      cartId: cart?.id,
      subtotal: getSummaryTotals(updatedItems),
    });
  },
);

const deleteCartItem = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const { cartItemId } = req.params;
    const userId = req.user?.id;

    const { deletedItem, cart } = await prisma.$transaction(async (tx) => {
      const deletedItem = await tx.cartItem.deleteMany({
        where: {
          id: cartItemId,
          cart: {
            userId,
          },
        },
      });

      const cart = await tx.cart.findUnique({
        where: { userId },
        select: {
          id: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              variant: {
                select: {
                  stock: {
                    select: {
                      quantity: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        cart,
        deletedItem,
      };
    });

    if (deletedItem.count === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      subtotal: getSummaryTotals(cart?.items),
    });
  },
);

const clearEntireCart = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!cart) {
      return res
        .status(200)
        .json({ success: true, message: "Cart already empty" });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    res.status(200).json({ success: true, message: "Cart cleared" });
  },
);

const updateCartItemQuantity = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const { cartItemId, quantity, variantId } = req.body;
    const userId = req.user?.id;

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        variantId,
        cart: {
          userId,
        },
      },
      include: {
        variant: {
          include: {
            stock: {
              select: {
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const availableStock = cartItem.variant.stock?.quantity || 0;
    winstonLogger.info("availableStock", availableStock);

    if (qty > availableStock) {
      return res.status(400).json({
        message: `Only ${availableStock} items available`,
      });
    }

    const cart = await prisma.$transaction(async (tx) => {
      await tx.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: qty },
      });

      return tx.cart.findUnique({
        where: { userId },
        select: {
          id: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              variant: {
                select: {
                  stock: {
                    select: {
                      quantity: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    return res.status(200).json({
      success: true,
      subtotal: getSummaryTotals(cart?.items),
      id: cartItemId,
      quantity: qty,
      unitPrice: cartItem.price,
    });
  },
);

export {
  addToCart,
  getCart,
  deleteCartItem,
  clearEntireCart,
  updateCartItemQuantity,
};
