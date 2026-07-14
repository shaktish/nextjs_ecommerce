import express from "express";
import {
  createOrder,
  createPayment,
  verifyPayment,
} from "../controller/paymentController";
import { AuthenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/createOrder", AuthenticateJWT, createOrder);
router.post("/", AuthenticateJWT, createPayment);
router.post("/verify", AuthenticateJWT, verifyPayment);

export default router;
