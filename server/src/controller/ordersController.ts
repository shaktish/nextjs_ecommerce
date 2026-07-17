import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";
import { ordersSchema } from "../validations/ordersValidation";
import winstonLogger from "../utils/winstonLogger";
import { OrderStatus } from "@prisma/client";

const getOrdersById = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const orderId = req.params.orderId;
    const order = await prisma.order.findFirst({
      where: {
        userId,
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res
      .status(200)
      .json({ id: order?.id, total: order?.total, status: order?.status });
  },
);

const getOrders = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;

    const { error, value } = ordersSchema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      winstonLogger.warn("Validation error", error.details);
      return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    const { page, limit } = value;
    const skip = (page - 1) * limit;
    const [orders, count] = await Promise.all([
      prisma.order.findMany({
        where: {
          userId,
        },
        take: limit,
        skip,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          total: true,
          shippingName: true,
          status: true,
          coupon: {
            select: {
              discountPercentage: true,
            },
          },

          items: {
            select: {
              productName: true,
              total: true,
              discount: true,
              variant: {
                select: {
                  product: {
                    select: {
                      slug: true,

                      images: {
                        select: {
                          url: true,
                        },
                      },
                      category: {
                        select: {
                          parentId: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);
    // const orders = await ;

    const formattedData = orders.map((order) => {
      return {
        id: order.id,
        createdAt: order.createdAt,
        total: order.total,
        shippingName: order.shippingName,
        status: order.status,
        discountPercentage: order.coupon?.discountPercentage,
        items: order.items.map((item) => {
          return {
            name: item.productName,
            slug: item.variant.product.slug,
            category: item.variant.product.category.parentId,
            imageUrl: item.variant.product.images[0]?.url || null,
            price: item.total,
            discount: item.discount,
          };
        }),
      };
    });
    return res
      .status(200)
      .json({ orders: formattedData, total: Math.ceil(count / limit) });
  },
);

const updateOrderStatus = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: status,
      },
    });

    return res.status(200).json(updatedOrder);
  },
);

export { getOrdersById, getOrders, updateOrderStatus };
