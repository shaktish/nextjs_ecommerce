import Redis from "ioredis";
import { NextFunction, Request, Response } from "express";

const redis = new Redis();

interface RateLimitOptions {
    limit?: number;
    window?: number;
}

export const rateLimiter = ({ limit = 100, window = 60 }: RateLimitOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip;
        const key = `rate:${ip}`;
        const current = await redis.incr(key);

        if (current === 1) {
            await redis.expire(key, window);
        }

        if (current > limit) {
            return res.status(429).json({ message: "Too many requests" });
        }

        next();
    };
};