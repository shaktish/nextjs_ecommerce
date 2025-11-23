import { NextFunction, Request, Response } from "express";

export const parseFormData = (arrayFields: string[] = []) => (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    Object.keys(body).forEach(key => {
        let value = body[key];

        if (typeof value !== "string") return;

        // Parse arrays only for specified fields
        if (arrayFields.includes(key)) {
            body[key] = value.split(",").map(v => v.trim());
            return;
        }

        // Booleans
        if (value === "true") { body[key] = true; return; }
        if (value === "false") { body[key] = false; return; }

        // Numbers (safe)
        if (/^-?\d+(\.\d+)?$/.test(value)) {
            body[key] = Number(value);
            return;
        }
    });

    console.log(req.body)
    next();
};