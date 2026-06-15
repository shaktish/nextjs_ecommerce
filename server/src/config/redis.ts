// import RedisClient from 'ioredis'
import { Redis } from "ioredis";
import config from "./envConfig";

let redisClient: Redis | null = null;

if (config.redisUrl) {
  redisClient = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redisClient.on("error", (err) => {
    console.error("❌ Redis error:", err);
  });
} else {
  console.log("⚠️ Redis disabled");
}

export default redisClient;
