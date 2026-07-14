import { Request, Response } from "express";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import asyncHandler from "../utils/asyncHandler";
import { prisma } from "../server";
import winstonLogger from "../utils/winstonLogger";
import { Coupon, Order, OrderItem, Payment } from "@prisma/client";
import { razorpay } from "../config/razorPay";
import crypto from "crypto";
import AppError from "../utils/AppError";
import config from "../config/envConfig";

type PaymentWithOrder = Payment & {
  order: Order & {
    items: OrderItem[];
  };
};

const finalizePayment = async (
  payment: PaymentWithOrder,
  razorpayPaymentId: string,
) => {
  const orderItems = payment.order.items;
  const order = payment.order;
  await prisma.$transaction(async (tx) => {
    // update stock and sold count for the product and product variant
    winstonLogger.info(
      `Completing payment ${payment.id} for order ${order.id}`,
    );
    // update payment
    const paymentUpdated = await tx.payment.updateMany({
      where: {
        id: payment.id,
        status: "PENDING",
      },
      data: {
        status: "COMPLETED",
        razorpayPaymentId,
      },
    });

    if (paymentUpdated.count === 0) {
      return;
    }

    for (const item of orderItems) {
      const stockUpdated = await tx.stock.updateMany({
        where: {
          variantId: item.variantId,
          quantity: {
            gte: item.quantity,
          },
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      if (stockUpdated.count === 0) {
        throw new AppError("Product is out of stock", 409);
      }

      await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
        },
        data: {
          soldCount: {
            increment: item.quantity,
          },
        },
      });
    }

    // update order
    await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "PROCESSING",
      },
    });

    // update coupon if applied
    if (order.couponId) {
      await tx.coupon.update({
        where: {
          id: order.couponId,
        },
        data: {
          usageCount: {
            increment: 1,
          },
        },
      });
    }

    // Delete cart items
    await tx.cartItem.deleteMany({
      where: {
        cart: {
          userId: payment.userId,
        },
      },
    });
  });
};

const createOrder = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const { addressId, couponCode } = req.body;
    if (!addressId) {
      return res.status(400).json({ message: "Address id not found" });
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    const cartId = cart?.id;

    if (!cartId) {
      return res.status(400).json({ message: "Cart not found" });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: cartId,
      },
      include: {
        variant: {
          include: {
            stock: true,
            product: {
              select: {
                name: true,
              },
            },
            size: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    winstonLogger.info("cartItems", cartItems);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items not found" });
    }

    const address = await prisma.address.findUnique({
      where: {
        userId,
        id: addressId,
      },
    });

    if (!address) {
      return res.status(400).json({ message: "Address not found" });
    }

    let coupon: Coupon | null = null;

    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: {
          code: couponCode,
        },
      });

      if (!coupon) {
        return res.status(400).json({
          message: "Coupon not found",
        });
      }
      const now = new Date();

      if (coupon.startDate > now) {
        return res.status(400).json({
          message: "Coupon is not active yet",
        });
      }

      if (coupon.endDate < now) {
        return res.status(400).json({
          message: "Coupon expired",
        });
      }

      if (coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({
          message: "Coupon usage limit reached",
        });
      }
    }

    const outOfStock = cartItems.find(
      (item) =>
        !item.variant.stock || item.variant.stock.quantity < item.quantity,
    );

    if (outOfStock) {
      return res.status(400).json({
        message: `${outOfStock.variant.product.name} is out of stock`,
      });
    }

    const priceChanged = cartItems.find(
      (item) => item.price !== item.variant.price,
    );

    if (priceChanged) {
      return res.status(400).json({
        message:
          "Price of one or more items has changed. Please review your cart.",
      });
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0,
    );
    const discountAmount = Math.round(
      (subtotal * (coupon?.discountPercentage ?? 0)) / 100,
    );
    const total = subtotal - discountAmount;

    // check if pending order exists with same cartItems
    const existingPendingOrder = await prisma.order.findFirst({
      where: {
        status: "PENDING",
        userId,
        total: total,
        couponId: coupon?.id,
        addressId: addressId,
      },
      include: {
        items: true,
      },
    });

    if (existingPendingOrder) {
      const isSameItems =
        existingPendingOrder.items.length === cartItems.length &&
        existingPendingOrder.items.every((orderItem) =>
          cartItems.some(
            (cartItem) =>
              cartItem.variantId === orderItem.variantId &&
              cartItem.quantity === orderItem.quantity,
          ),
        );

      if (isSameItems) {
        return res.status(200).json({
          orderId: existingPendingOrder.id,
        });
      }
    }
    // create order
    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          phone: address.phone,
          shippingAddress: address.address,
          shippingCity: address.city,
          shippingCountry: address.country,
          shippingName: address.name,
          shippingPostalCode: address.postalCode,
          shippingState: address.state,
          total: total,
          addressId: addressId,
          couponId: coupon?.id,
          userId: userId!,
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => {
          const itemSubtotal = item.variant.price * item.quantity;
          const itemDiscount = Math.round(
            (itemSubtotal * (coupon?.discountPercentage ?? 0)) / 100,
          );

          return {
            orderId: order.id,
            variantId: item.variantId,

            subtotal: itemSubtotal,
            discount: itemDiscount,
            total: itemSubtotal - itemDiscount,

            quantity: item.quantity,

            productName: item.variant.product.name,
            sizeName: item.variant.size.name,
            sku: item.variant.sku,
          };
        }),
      });

      return order;
    });

    return res.status(200).json({
      orderId: order.id,
    });
  },
);

const createPayment = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const orderId = req.body.orderId;

    // get the order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: "PENDING",
      },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    // check if payment exists
    const payment = await prisma.payment.findFirst({
      where: {
        orderId,
        status: "PENDING",
      },
    });

    if (payment) {
      winstonLogger.info("Payment already exists");
      return res.status(200).json({
        razorpayOrderId: payment.razorpayOrderId,
        amount: payment.amount * 100,
        currency: payment.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } else {
      const total = order.total;
      const razorpayOrder = await razorpay.orders.create({
        amount: total * 100,
        currency: "INR",
        receipt: order.id,
      });

      if (!razorpayOrder.id) {
        return res.status(400).json({
          message: "Failed to create razorpay transaction",
        });
      }

      await prisma.payment.create({
        data: {
          orderId: order.id,
          razorpayOrderId: razorpayOrder.id,
          amount: total,
          currency: "INR",
          status: "PENDING",
          userId: userId!,
        },
      });

      return res.status(200).json({
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }
  },
);

const verifyPayment = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    winstonLogger.info("called verifyPayment api");
    const userId = req.user?.id;
    const { razorpayOrderId, razorpayPaymentId, razorpay_signature } = req.body;
    const payment = await prisma.payment.findFirst({
      where: {
        razorpayOrderId,
        userId,
      },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!payment) {
      winstonLogger.error("Payment not found");
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (!payment?.order) {
      winstonLogger.error("Order not found");
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // verify razor sign
    const generatedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      winstonLogger.error("Sign not valid");
      return res.status(400).json({
        message: "Invalid signature",
      });
    }

    // already verified
    if (payment.status === "COMPLETED") {
      winstonLogger.info("Payment already verified");
      return res.status(200).json({
        message: "Payment already verified",
      });
    }
    // cancelled order
    if (payment.order.status === "CANCELLED") {
      winstonLogger.error("payment is cancelled");
      return res.status(400).json({
        message: "Order has been cancelled",
      });
    }

    await finalizePayment(
      {
        ...payment,
        order: payment.order!,
      },
      razorpayPaymentId,
    );

    return res.status(200).json({
      message: "Payment verified successfully",
    });
  },
);

const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  winstonLogger.info("Called Razorpay webhook");
  const signature = req.headers["x-razorpay-signature"] as string;

  // Verify webhook signature
  const generatedSignature = crypto
    .createHmac("sha256", config.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

  if (generatedSignature !== signature) {
    winstonLogger.warn("Invalid Razorpay webhook signature");
    return res.status(400).json({
      message: "Invalid signature",
    });
  }
  winstonLogger.info("sign valid, proceeding to parse event");
  // Parse event
  const event = JSON.parse(req.body.toString());
  if (event.event !== "payment.captured") {
    return res.sendStatus(200);
  }
  winstonLogger.info(`Received Razorpay webhook: ${event.event}`);
  const paymentEntity = event.payload.payment.entity;
  const razorpayOrderId = paymentEntity.order_id;
  const razorpayPaymentId = paymentEntity.id;
  // Find payment
  const payment = await prisma.payment.findFirst({
    where: {
      razorpayOrderId,
    },
    include: {
      order: {
        include: {
          items: true,
        },
      },
    },
  });
  // Payment not found
  if (!payment?.order) {
    winstonLogger.error(`Payment ${payment?.id} has no associated order`);
    return res.sendStatus(200);
  }

  // Payment already completed
  if (payment.status === "COMPLETED") {
    winstonLogger.error(`Payment already completed`);
    return res.sendStatus(200);
  }

  await finalizePayment(
    {
      ...payment,
      order: payment.order!,
    },
    razorpayPaymentId,
  );

  return res.sendStatus(200);
});

export { createOrder, createPayment, verifyPayment, razorpayWebhook };
