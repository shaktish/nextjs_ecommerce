import express from "express";
import { razorpayWebhook } from "../controller/paymentController";

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), razorpayWebhook);

export default router;
