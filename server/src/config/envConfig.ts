import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  env: string;
  redisUrl: string;
  jwtSecret: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  NEXT_APP_URL: string;
  REVALIDATE_SECRET: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
}
const config: Config = {
  port: Number(process.env.PORT) || 5010,
  env: process.env.NODE_ENV || "",
  redisUrl: process.env.REDIS_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  NEXT_APP_URL: process.env.NEXT_APP_URL || "",
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
};

export default config;
