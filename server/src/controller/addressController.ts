import { Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticateRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";
import { addressSchema } from "../validations/addressValidation";
import winstonLogger from "../utils/winstonLogger";

const getAddress = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    winstonLogger.info("get address");
    const userId = req.user?.id;
    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });

    if (addresses.length === 0) {
      return res
        .status(200)
        .json({ data: [], message: "No addresses found for the user" });
    }
    res.status(200).json({ data: addresses });
  },
);

const getAddressById = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    winstonLogger.info("getAddressById");
    const userId = req.user?.id;
    const id = req.params.id;
    const data = await prisma.address.findFirst({
      where: {
        userId,
        id,
      },
    });

    res.status(200).json(data);
  },
);

const addAddress = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const { error, value } = addressSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid address data", errors: error.details });
    }

    const address = await prisma.$transaction(async (tx) => {
      if (value.isDefault) {
        await tx.address.updateMany({
          where: {
            userId: userId,
          },
          data: {
            isDefault: false,
          },
        });
      }

      await tx.address.create({
        data: {
          ...value,
          userId: userId!,
        },
      });
    });
    return res
      .status(201)
      .json({ message: "Address added successfully", data: address });
  },
);

const updateAddress = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    winstonLogger.info("update address method called");
    const userId = req.user?.id;
    const { error, value } = addressSchema.validate(req.body, {
      abortEarly: false,
    });
    const addressId = req.params.id;
    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid address data", errors: error.details });
    }

    try {
      const existingAddress = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });

      if (!existingAddress || existingAddress.userId !== userId) {
        return res.status(404).json({ message: "Address not found" });
      }

      const updatedAddress = await prisma.$transaction(async (tx) => {
        if (value.isDefault) {
          await tx.address.updateMany({
            where: {
              userId: userId,
            },
            data: {
              isDefault: false,
            },
          });
        }
        return await tx.address.update({
          where: {
            id: addressId,
          },
          data: value,
        });
      });
      return res.status(200).json({
        message: "Address updated successfully",
        data: updatedAddress,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Failed to update address",
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  },
);
const removeAddress = asyncHandler(
  async (req: AuthenticateRequest, res: Response) => {
    const userId = req.user?.id;
    const addressId = req.params.id;
    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    try {
      const existingAddress = await prisma.address.findFirst({
        where: {
          id: addressId,
        },
      });
      if (!existingAddress || existingAddress.userId !== userId) {
        return res.status(404).json({ message: "Address not found" });
      }

      await prisma.address.delete({
        where: {
          id: addressId,
        },
      });
      return res.status(200).json({ message: "Address deleted successfully" });
    } catch (e) {
      return res.status(500).json({
        message: "Failed to delete address",
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  },
);

export { addAddress, getAddress, removeAddress, updateAddress, getAddressById };
