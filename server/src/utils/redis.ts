import { Redis } from "@upstash/redis";
import { REDIS_REST_TOKEN, REDIS_REST_URL } from "../config/config";

// Check for required environment variables
if (!REDIS_REST_URL || !REDIS_REST_TOKEN) {
    throw new Error("Environment variables REDIS_URL or REDIS_TOKEN are not defined.");
}

// Initialize Upstash Redis client
const redis = new Redis({
    url: REDIS_REST_URL,
    token: REDIS_REST_TOKEN,
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