import { app } from "./app";
import { database } from "./config/database";
import { redis } from "./config/redis";
import { cloudinaryService } from "./config/cloudinary";

const bootstrap = async () => {
  try {
    // ---------- Connect MongoDB ----------
    await database.connect();

    // ---------- Connect Redis (Upstash) ----------
    await redis.connect();

    // ---------- Connect Cloudinary ----------
    await cloudinaryService.connect();

    // ---------- Start server ----------
    await app.connect();

    // ---------- Graceful Shutdown ----------
    const shutdown = async () => {
      await app.disconnect();
      await database.disconnect();
      await redis.disconnect();
      await cloudinaryService.disconnect();
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[Server] Error:", message);
    process.exit(1);
  }
};

bootstrap();
