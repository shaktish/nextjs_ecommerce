import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProductsAdmin,
  getCategoriesLookup,
  getFeaturedProducts,
  getProduct,
  getProductCategories,
  getProductLookups,
  getProductsForClient,
  updateProduct,
} from "../controller/productController.ts";
import { AuthenticateJWT, isAdmin } from "../middleware/authMiddleware.ts";
import { upload } from "../middleware/middleware.ts";

const router = express.Router();
router.get("/lookup", getProductLookups);
router.get("/lookup-categories", getCategoriesLookup);
router.get("/product-categories", getProductCategories);
router.get("/feature-products", getFeaturedProducts);
router.get("/get-products", getProductsForClient);
router.get(
  "/getAllProductsAdmin",
  AuthenticateJWT,
  isAdmin,
  getAllProductsAdmin,
);
router.post(
  "/",
  AuthenticateJWT,
  isAdmin,
  upload.array("images", 10),
  createProduct,
);
router.get("/:id", getProduct);
router.patch(
  "/:id",
  upload.array("images", 10),
  AuthenticateJWT,
  updateProduct,
);
router.delete("/:id", AuthenticateJWT, isAdmin, deleteProduct);

export default router;
