import { NextFunction, Request, Response } from "express";
import winstonLogger from "../utils/winstonLogger.ts";

const loggerHandler = (request: Request, _response: Response, next: NextFunction) => {
    // Log the request method and URL
    winstonLogger.info(`📥 Received ${request.method} request to ${request.url}`);
    // Log request body safely (convert to string)
    if (Object.keys(request.body || {}).length > 0) {
        winstonLogger.info(`🧾 Request Body: ${JSON.stringify(request.body)}`);
    }
    next();
}

export default loggerHandler;