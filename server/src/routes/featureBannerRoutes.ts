import express from 'express';
import { createFeatureBanner, getAllFeatureBanner, updateFeatureBanner } from '../controller/featureBannerController';
import { AuthenticateJWT } from '../middleware/authMiddleware';
import { upload } from '../middleware/middlware';

const router = express.Router();

router.post('/', AuthenticateJWT, upload.array("images", 4), createFeatureBanner)
router.patch('/', AuthenticateJWT, upload.array("images", 4), updateFeatureBanner)
router.get('/', AuthenticateJWT, getAllFeatureBanner);

export default router;