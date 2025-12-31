import config from "../config/envConfig.ts";
import { UserI } from "../types/authTypes.ts";
import { jwtVerify, SignJWT, JWTPayload } from "jose";
import { v4 as uuidv4 } from "uuid";


const secret = new TextEncoder().encode(config.jwtSecret)
export interface JWTPayloadData extends JWTPayload {
    id: string;
    email: string;
    name: string;
    role?: string
}

const generateTokens = async (user: UserI) => {
    const { id, email, name, role } = user;
    const payload: JWTPayloadData = {
        id,
        email,
        name,
        role
    }
    // sign in access token 
    const accessToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuer("sreevasam-app")
        .setAudience("sreevasam-users")
        .setExpirationTime("3h")
        // .setExpirationTime("1m")
        .setIssuedAt()
        .sign(secret);

    const refreshTokenId = uuidv4(); // unique ID for tracking in DB
    const refreshToken = await new SignJWT({ id, refreshTokenId }).setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuer("sreevasam-app")
        .setAudience("sreevasam-users")
        .setExpirationTime("7d")
        .setIssuedAt()
        .sign(secret);;
    return { accessToken, refreshToken };
}

const verifyToken = async (token: string): Promise<JWTPayload> => {
    const { payload } = await jwtVerify(token, secret, {
        issuer: "sreevasam-app",
        audience: "sreevasam-users",
        algorithms: ["HS256"],
    });
    return payload;
}

export {
    generateTokens,
    verifyToken
}