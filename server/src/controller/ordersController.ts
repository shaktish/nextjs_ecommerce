import { Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

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

export { getOrdersById };
