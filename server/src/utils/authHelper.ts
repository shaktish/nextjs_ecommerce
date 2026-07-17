import { Response } from "express";
import config from "../config/envConfig";
import { prisma } from "../server";
import winstonLogger from "./winstonLogger";
import bcrypt from "bcryptjs";
import {
  ACCESS_TOKEN_EXPIRY_TIME,
  ONE_DAY,
  SEVEN_DAYS,
  TEN_MINUTES,
} from "../constants/time";

const updateRefreshTokenToDb = async (userId: string, refreshToken: string) => {
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedToken,
      },
    });
  } catch (e) {
    winstonLogger.error("Failed to save refresh token", e);
    throw new Error("Token persistence failed");
  }
};

const setTokens = async (
  res: Response,
  accessToken: string,
  refreshToken: string,
  userId: string,
) => {
  const isProd = config.env === "production";
  const httpCookieHelper = (
    httpOnly: boolean,
    secure: boolean,
    sameSite: CookieSameSite,
    maxAge: number,
    path: string,
  ) => {
    return {
      httpOnly,
      secure,
      sameSite,
      maxAge,
      path,
    };
  };

  await updateRefreshTokenToDb(userId, refreshToken);
  const COOKIE_SAME_SITE: CookieSameSite = isProd ? "none" : "lax";
  const accessTokenCookieData = httpCookieHelper(
    true,
    isProd,
    COOKIE_SAME_SITE,
    isProd ? TEN_MINUTES : ACCESS_TOKEN_EXPIRY_TIME, // 1hr
    "/",
  );
  const refreshTokenCookieData = httpCookieHelper(
    true,
    isProd,
    COOKIE_SAME_SITE,
    SEVEN_DAYS,
    "/",
  );
  res.cookie("accessToken", accessToken, accessTokenCookieData);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieData);
};

const clearRefreshTokenToDb = async (userId: string) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
  } catch (e) {
    winstonLogger.error("Failed to update refresh token", e);
    throw new Error("Token persistence failed");
  }
};
const clearTokens = async (res: Response, userId: string) => {
  await clearRefreshTokenToDb(userId);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

export { setTokens, clearTokens };
