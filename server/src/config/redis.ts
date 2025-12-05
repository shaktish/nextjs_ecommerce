// import RedisClient from 'ioredis'
import { Redis } from "ioredis";
import config from './envConfig'

const redisUrl = config.redisUrl;
if (!redisUrl) {
    throw new Error("REDIS_URL is not defined");
}

const redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redisClient.on("connect", () => {
    console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis error:", err);
});

export default redisClient;

