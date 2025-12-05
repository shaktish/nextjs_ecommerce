import { prisma } from "../server.js";
import redis from "../config/redis.js";
import winstonLogger from "./winstonLogger.js";

export const registerProcessHandlers = () => {
    const shutdown = async () => {
        winstonLogger.error("🔻 Graceful shutdown...");
        try {
            await prisma.$disconnect();
            await redis.quit();
        } catch (err) {
            console.error("Error during shutdown:", err);
        } finally {
            process.exit(1);
        }
    };

    process.on("uncaughtException", (err) => {
        winstonLogger.error("🔥 UNCAUGHT EXCEPTION:", err);
        shutdown();
    });

    process.on("unhandledRejection", (reason) => {
        winstonLogger.error("💥 UNHANDLED REJECTION:", reason);
        shutdown();
    });
};
