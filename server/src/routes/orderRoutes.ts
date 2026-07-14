import express from "express";
import { getOrdersById } from "../controller/ordersController";
import { AuthenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:orderId", AuthenticateJWT, getOrdersById);

export default router;
