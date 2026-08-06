import express from "express";
import {
  getOrders,
  getAllOrdersAdmin,
  getOrdersById,
  updateOrderStatus,
} from "../controller/ordersController";
import { AuthenticateJWT, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", AuthenticateJWT, getOrders);
router.get("/admin", AuthenticateJWT, isAdmin, getAllOrdersAdmin);
router.patch("/:orderId/status", AuthenticateJWT, isAdmin, updateOrderStatus);
router.get("/:orderId", AuthenticateJWT, getOrdersById);

export default router;
