import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    env: string;
    redisUrl: string;
    jwtSecret: string,
    CLOUDINARY_CLOUD_NAME: string,
    CLOUDINARY_API_KEY: string,
    CLOUDINARY_API_SECRET: string
}
const config: Config = {
    port: Number(process.env.PORT) || 5010,
    env: process.env.NODE_ENV || '',
    redisUrl: process.env.REDIS_URL || '',
    jwtSecret: process.env.JWT_SECRET || '',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || ''

}

export default config; 
