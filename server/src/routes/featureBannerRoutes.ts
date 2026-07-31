import express from "express";
import {
  getAllFeatureBanner,
  updateFeatureBanner,
} from "../controller/featureBannerController";
import { AuthenticateJWT } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer";

const router = express.Router();
router.patch(
  "/",
  AuthenticateJWT,
  upload.array("images", 4),
  updateFeatureBanner,
);
router.get("/", getAllFeatureBanner);

export default router;
