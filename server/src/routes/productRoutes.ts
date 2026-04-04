import express from 'express';
import { createProduct, deleteProduct, getAllProductsAdmin, getCategoriesLookup, getFeaturedProducts, getProduct, getProductLookups, updateProduct } from '../controller/productController.ts';
import { AuthenticateJWT, isAdmin } from '../middleware/authMiddleware.ts';
import { upload } from '../middleware/middlware.ts';
import { parseFormData } from '../middleware/parseData.ts';


const router = express.Router();
router.get("/lookup", AuthenticateJWT, getProductLookups);
router.get("/categories", AuthenticateJWT, getCategoriesLookup);
router.get('/feature-products', AuthenticateJWT, getFeaturedProducts);
router.get('/getAllProductsAdmin', AuthenticateJWT, isAdmin, getAllProductsAdmin);
router.post('/', AuthenticateJWT, isAdmin, upload.array("images", 10), createProduct);
router.get('/:id', AuthenticateJWT, getProduct);
router.patch('/:id', upload.array("images", 10), AuthenticateJWT, updateProduct);
router.delete('/:id', AuthenticateJWT, isAdmin, deleteProduct);



export default router;

