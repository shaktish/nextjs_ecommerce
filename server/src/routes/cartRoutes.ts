import express from "express";
import { AuthenticateJWT } from "../middleware/authMiddleware";
import { addToCart, clearEntireCart, deleteCartItem, getCart, updateCartItemQuantity } from "../controller/cartController";

const router = express.Router();

router.post('/', AuthenticateJWT, addToCart);
router.get('/', AuthenticateJWT, getCart);
router.delete('/item/:cartItemId', AuthenticateJWT, deleteCartItem);
router.delete('/', AuthenticateJWT, clearEntireCart)
router.patch('/', AuthenticateJWT, updateCartItemQuantity);



export default router;