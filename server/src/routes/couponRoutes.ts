import express from 'express';
import { createCoupon, deleteCoupon, getAllCoupon, updateCoupon, getCouponById } from '../controller/couponController';
import { AuthenticateJWT, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', AuthenticateJWT, isAdmin, createCoupon)
router.get('/', AuthenticateJWT, isAdmin, getAllCoupon)
router.get('/:id', AuthenticateJWT, isAdmin, getCouponById)
router.patch('/:id', AuthenticateJWT, isAdmin, updateCoupon)
router.delete('/:id', AuthenticateJWT, isAdmin, deleteCoupon);

export default router;

