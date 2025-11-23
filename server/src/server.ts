import express, { Express } from 'express';
import config from './config/envConfig.ts';
import winstonLogger from './utils/winstonLogger.ts';
import { healthChecker } from './controller/health.ts';
import globalErrorHandler from './middleware/globalErrorHandler.ts';
import AuthRoutes from './routes/authRoutes.ts';
import ProductRoutes from './routes/productRoutes.ts'
import loggerHandler from './middleware/loggerHandler.ts';
import { PrismaClient } from '../generated/prisma/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/cors.ts';
import { setupGracefulShutdown } from './utils/gracefulShutdown.ts';
import { AuthenticateJWT, isAdmin } from './middleware/authMiddleware.ts';

export const prisma = new PrismaClient();
const app: Express = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(loggerHandler);
app.get("/health", healthChecker)
app.use("/api/auth", AuthRoutes)
app.use("/api/product", ProductRoutes);
app.use(globalErrorHandler);

app.listen(config.port, () => {
    winstonLogger.info(`App started at http://localhost:${config.port}`)
});
setupGracefulShutdown(prisma);
