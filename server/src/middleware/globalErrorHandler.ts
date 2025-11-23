import { NextFunction, Request, Response } from "express";
import winstonLogger from "../utils/winstonLogger.ts";
import AppError from "../utils/AppError.ts";

// This catches all errors passed with "next(error)" in Express routes.
const globalErrorHandler = (
    error: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Determine status and message
    const statusCode = error?.statusCode ?? 500;
    const message = error?.message || "Internal Server Error";

    // ✅ Log detailed error info via Winston
    if (error.isOperational) {
        // Expected / handled errors (e.g., validation, bad input)
        winstonLogger.warn("⚠️ Operational Error", {
            statusCode,
            message,
            stack: error.stack,
        });
    } else {
        // Unexpected / programming or system errors
        winstonLogger.error("💥 Unexpected Error", {
            statusCode,
            message,
            stack: error.stack,
        });
    }

    // ✅ Respond with standardized error payload
    res.status(statusCode).json({
        success: false,
        message,
    });
};
export default globalErrorHandler;