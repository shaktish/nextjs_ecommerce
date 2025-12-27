import { Response } from "express";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import asyncHandler from "../utils/asyncHandler";
import { createCouponSchema } from "../validations/couponValidation";
import winstonLogger from "../utils/winstonLogger";
import { prisma } from "../server";

const createCoupon = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const { error, value } = createCouponSchema.validate(req.body, { abortEarly: false });
    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }

    const coupon = await prisma.coupon.create({
        data: value
    })

    return res.status(201).json({
        message: "Coupon created successfully", data: {
            id: coupon.id,
            name: coupon.code,
        }
    });
})

const getAllCoupon = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const coupons = await prisma.coupon.findMany();
    return res.status(200).json({ data: coupons });
})

const updateCoupon = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const { error, value } = createCouponSchema.validate(req.body, { abortEarly: false });
    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }
    const id = req.params.id;
    const coupon = await prisma.coupon.update({
        where: { id },
        data: value
    })

    return res.status(200).json({
        message: "Coupon updated successfully", data: {
            id: coupon.id,
            name: coupon.code,
        }
    });
})

const getCouponById = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const id = req.params.id
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
    }
    return res.status(200).json({ data: coupon });
});

const deleteCoupon = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const id = req.params.id;
    await prisma.coupon.delete({ where: { id } });
    return res.status(200).json({ message: 'Coupon deleted successfully' });
})

export {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponById
}