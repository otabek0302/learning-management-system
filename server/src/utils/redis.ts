import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
    throw new Error("Environment variables REDIS_URL or REDIS_TOKEN are not defined.");
}

// Initialize Upstash Redis client
const redis = new Redis({
    url: process.env.REDIS_REST_URL,
    token: process.env.REDIS_REST_TOKEN,
});

// Test the connection
(async () => {
    try {
        const pong = await redis.ping();
        console.log("🔌 Upstash Redis connected successfully:", pong);
    } catch (error) {
        console.error("❌ Failed to connect to Upstash Redis:", error);
    }
})();

export default redis;