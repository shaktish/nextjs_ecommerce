import express from "express";
import {
  addAddress,
  getAddress,
  getAddressById,
  removeAddress,
  updateAddress,
} from "../controller/addressController";
import { AuthenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", AuthenticateJWT, addAddress);
router.get("/", AuthenticateJWT, getAddress);
router.get("/:id", AuthenticateJWT, getAddressById);
router.patch("/:id", AuthenticateJWT, updateAddress);
router.delete("/:id", AuthenticateJWT, removeAddress);

export default router;
