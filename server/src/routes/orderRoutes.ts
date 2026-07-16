import express from "express";
import {
  getOrders,
  getOrdersById,
  updateOrderStatus,
} from "../controller/ordersController";
import { AuthenticateJWT, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", AuthenticateJWT, getOrders);
router.patch("/:orderId/status", AuthenticateJWT, isAdmin, updateOrderStatus);
router.get("/:orderId", AuthenticateJWT, getOrdersById);

export default router;
