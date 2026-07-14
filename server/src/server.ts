import { registerProcessHandlers } from "./utils/processHandlers";
import config from "./config/envConfig";
registerProcessHandlers();
import express, { Express } from "express";

import winstonLogger from "./utils/winstonLogger";
import { healthChecker } from "./controller/health";
import globalErrorHandler from "./middleware/globalErrorHandler";
import AuthRoutes from "./routes/authRoutes";
import ProductRoutes from "./routes/productRoutes";
import loggerHandler from "./middleware/loggerHandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors";
import { rateLimiter } from "./config/rateLimiter";
import CouponRoutes from "./routes/couponRoutes";
import FeatureBannerRoutes from "./routes/featureBannerRoutes";
import CartRoutes from "./routes/cartRoutes";
import AddressRoutes from "./routes/addressRoutes";
import { PrismaClient } from "@prisma/client";
import PaymentRoutes from "./routes/paymentRoutes";
import OrderRoutes from "./routes/orderRoutes";
import RazorWebhook from "./routes/paymentWebhookRoutes";

export const prisma = new PrismaClient();
const app: Express = express();

app.use("/api/razorWebhook", RazorWebhook);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
// app.use(rateLimiter({ limit: 100, window: 60 }));
app.use(loggerHandler);

app.get("/health", healthChecker);
app.use("/api/auth", AuthRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/coupon", CouponRoutes);
app.use("/api/feature-banner", FeatureBannerRoutes);
app.use("/api/address", AddressRoutes);
app.use("/api/payment", PaymentRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/order", OrderRoutes);

app.use(globalErrorHandler);

app.listen(config.port, () => {
  winstonLogger.info(`App started at http://localhost:${config.port}`);
});
