import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import { loginSchema, registerSchema } from "../validations/authValidation.ts";
import { LoginRequestBody, RegisterRequestBody } from "../types/authTypes.ts";
import winstonLogger from "../utils/winstonLogger.ts";
import { prisma } from "../server.ts";
import { compassPassword, hashPassword } from "../utils/hashPassword.ts";
import { generateTokens } from "../utils/jwtHelper.ts";
import { clearTokens, setTokens } from "../utils/authHelper.ts";
import config from '../config/envConfig.ts';

const register = asyncHandler(async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    // 1 Validate request body
    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }
    // 2️ Check if user exists
    const { email, name, password } = value;
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }
    // 3️ Hash password
    const hashedPassword = await hashPassword(password);

    // 4️ Create user
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
        select: {
            id: true, email: true, name: true, createdAt: true
        }
    })

    // 5️ Respond
    return res.status(201).json({ message: "User created successfully", data: user });
});

const login = asyncHandler(async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    // 1 Validate request body
    if (error) {
        winstonLogger.warn("Validation error", error.details);
        return res.status(400).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
        });
    }
    // 2. validate user email in the db and validate user password
    const { email, password } = value;
    const user = await prisma.user.findUnique({ where: { email } });
    const isPasswordValid = await compassPassword(password, user?.password ?? '');
    if (!user || !isPasswordValid) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    // 3. create our access and refresh tokens
    const userInfo = { id: user.id, email: user.email, role: user.role ?? 'User', name: user.name ?? '' }
    const { accessToken, refreshToken } = await generateTokens(userInfo);

    // 4. set the tokens to the response
    await setTokens(res, accessToken, refreshToken, userInfo.id);
    res.status(200).json({ message: "Login Successful", user: userInfo });
})

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken, 'refreshToken')
    // 1. check for refresh token
    if (!refreshToken) {
        return res.status(401).json({
            message: "Invalid refresh",
        });
    }
    // 2. Fetch user by ID 
    const decoded = jwt.verify(refreshToken, config.jwtSecret) as { id: string };

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id
        }
    })

    if (!user) {
        return res.status(401).json({
            message: "User not found",
        });
    }
    // 3. validate refresh token
    const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken ?? '');

    if (!tokenValid) {
        return res.status(401).json({
            message: "Refresh token mismatch",
        });
    }
    // 4. Generate new tokens
    const userInfo = { id: user.id, email: user.email, role: user.role, name: user.name ?? '' }
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(userInfo);

    // 5. set new tokens and update db 
    await setTokens(res, accessToken, newRefreshToken, userInfo.id);
    res.status(200).json({ message: "Access token updated Successfully", userInfo });

})

const logout = asyncHandler(async (req: Request, res: Response) => {
    // 1. check for token
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Invalid refresh",
        });
    }

    // 2. Decode user ID from token
    const decoded = jwt.verify(refreshToken, config.jwtSecret) as { id: string };
    // fetch user 
    const user = await prisma.user.findUnique({
        where: { id: decoded.id }
    })

    if (!user) {
        return res.status(401).json({
            message: "User not found",
        });
    }

    // 3. validate token
    const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken ?? '');
    if (!tokenValid) {
        return res.status(401).json({
            message: "Refresh token mismatch",
        });
    }
    // 4. remove token and update in db 
    await clearTokens(res, user?.id);

    return res.status(200).json({ message: "Successfully logged out" })

});

export {
    register,
    login,
    logout,
    refreshAccessToken
}