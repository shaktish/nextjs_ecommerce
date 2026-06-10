import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";
import { addressSchema, updateAddressSchema } from "../validations/addressValidation";

const getAddress = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const addresses = await prisma.address.findMany({
        where: {
            userId,
        }
    });

    if (addresses.length === 0) {
        return res.status(404).json({ message: "No addresses found for the user" });
    }
    res.status(200).json({ data: addresses });
});

const addAddress = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const { error, value } = addressSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ message: "Invalid address data", errors: error.details });
    }
    try {
        const newAddress = await prisma.address.create({
            data: {
                ...value,
                userId: userId!,
            }

        });
        if (newAddress) {
            return res.status(201).json({ message: "Address added successfully", data: newAddress });
        }
    } catch (e) {
        return res.status(500).json({ message: "Failed to add address", error: e instanceof Error ? e.message : "Unknown error" });
    }
});

const updateAddress = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const { error, value } = updateAddressSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "Invalid address data", errors: error.details });
    }

    const addressId = value.id;
    try {
        const existingAddress = await prisma.address.findUnique({
            where: {
                id: addressId,
            }
        });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ message: "Address not found" });
        }

        const updatedAddress = await prisma.address.update({
            where: {
                id: addressId,
            },
            data: {
                address: value.address,
                city: value.city,
                state: value.state,
                postalCode: value.postalCode,
                country: value.country
            }
        });
        return res.status(200).json({ message: "Address updated successfully", data: updatedAddress });

    } catch (e) {
        return res.status(500).json({ message: "Failed to update address", error: e instanceof Error ? e.message : "Unknown error" });
    }

});
const removeAddress = asyncHandler(async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const { adddressId } = req.params;
    if (adddressId) {
        return res.status(400).json({ message: "Address ID is required" });
    }

    try {
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: adddressId,
            }
        });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ message: "Address not found" });
        }

        await prisma.address.delete({
            where: {
                id: adddressId,
            },
        });
        return res.status(200).json({ message: "Address deleted successfully" });

    } catch (e) {
        return res.status(500).json({ message: "Failed to delete address", error: e instanceof Error ? e.message : "Unknown error" });
    }

});


export {
    addAddress,
    getAddress,
    removeAddress,
    updateAddress,

}