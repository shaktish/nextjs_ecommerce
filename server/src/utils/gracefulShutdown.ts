import { PrismaClient } from "@prisma/client";
import winstonLogger from "./winstonLogger.ts";


export const setupGracefulShutdown = (prisma: PrismaClient) => {
    const shutdown = async (signal: string) => {
        winstonLogger.info(`\n🛑 Received ${signal}. Closing Prisma connection...`);
        await prisma.$disconnect();
        winstonLogger.info("✅ Prisma disconnected. Exiting now...");
        process.exit(0);
    };

    ["SIGINT", "SIGTERM"].forEach(signal =>
        process.on(signal, () => shutdown(signal))
    );
};