import { Response } from "express";
import config from "../config/envConfig.ts";
import { prisma } from "../server.ts";
import winstonLogger from "./winstonLogger.ts";
import bcrypt from "bcryptjs";

const updateRefreshTokenToDb = async (userId: string, refreshToken: string) => {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: hashedToken
            }
        });
    } catch (e) {
        winstonLogger.error("Failed to save refresh token", e);
        throw new Error("Token persistence failed");
    }

}

const setTokens = async (res: Response, accessToken: string, refreshToken: string, userId: string) => {
    const isProd = config.env === "production";
    await updateRefreshTokenToDb(userId, refreshToken);
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: isProd ? "none" : "lax",
        maxAge: isProd ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000,// 1 hour / 1 day
        // maxAge: isProd ? 60 * 60 * 1000 : 60 * 1000,// 1min
        path: "/",
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
    })
}

const clearRefreshTokenToDb = async (userId: string) => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: null
            }
        });
    } catch (e) {
        winstonLogger.error("Failed to update refresh token", e);
        throw new Error("Token persistence failed");
    }
}
const clearTokens = async (res: Response, userId: string) => {
    await clearRefreshTokenToDb(userId);
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
}

export {
    setTokens,
    clearTokens
}