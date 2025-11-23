import express from "express";
import { login, logout, refreshAccessToken, register } from "../controller/authController.ts";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refreshToken', refreshAccessToken);

export default router;