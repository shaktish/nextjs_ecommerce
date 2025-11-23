import { NextFunction, Request, Response } from "express";
import { UserI } from "../types/authTypes.ts";
import { verifyToken } from "../utils/jwtHelper.ts";
import {
    JWTExpired,
    JWSSignatureVerificationFailed,
    JWTInvalid
} from "jose/errors";
import winstonLogger from "../utils/winstonLogger.ts";
import asyncHandler from "../utils/asyncHandler.ts";

export interface AuthenticateRequest extends Request {
    user?: UserI;
}

export const AuthenticateJWT = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    const userAccessToken = req?.cookies?.accessToken;
    if (!userAccessToken) {
        res.status(401).json({ message: "Unauthorized Access token is not present" });
        return;
    }
    try {
        const payload = await verifyToken(userAccessToken)
        req.user = {
            id: payload.id as string,
            email: payload.email as string,
            name: payload.name as string,
            role: payload.role as string,
        };
        return next();
    } catch (e) {
        winstonLogger.error(e);
        if (e instanceof JWTExpired) {
            return res.status(401).json({ code: "TOKEN_EXPIRED", message: "Access token expired" });
        }
        if (e instanceof JWSSignatureVerificationFailed) {
            return res.status(401).json({ code: "TOKEN_INVALID", message: "Signature verification failed" });
        }
        if (e instanceof JWTInvalid) {
            return res.status(401).json({ code: "TOKEN_INVALID", message: "Invalid JWT structure" });
        }

        return res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
}

export const isAdmin = asyncHandler(async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'Admin') {
        return res.status(403).json({ message: "Access denied, Admin access required" });
    }
    return next();
})