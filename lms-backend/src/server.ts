import express from "express";

import { env } from "@config/env.config";
import { connectCloudinary, disconnectCloudinary } from "@services/cloudinary.service";
import { connectDatabase, disconnectDatabase } from "@services/database.service";
import { connectRedis, disconnectRedis } from "@services/redis.service";
import { logger } from "@shared/services/logger.service";
import { errorMiddleware } from "@middlewares/error.middleware";
import { userRoutes } from "@/modules/user/user.routes";
import { compressionPlugin } from "@plugins/compression.plugin";
import { cookiePlugin } from "@plugins/cookie.plugin";
import { corsPlugin } from "@plugins/cors.plugin";
import { helmetPlugin } from "@plugins/helmet.plugin";
import { morganPlugin } from "@plugins/morgan.plugin";
import { rateLimitPlugin } from "@plugins/rate-limit.plugin";
import { securityPlugin } from "@plugins/security.plugin";

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Plugins (order matters)
securityPlugin(app);
corsPlugin(app);
rateLimitPlugin(app);
compressionPlugin(app);
cookiePlugin(app);
helmetPlugin(app);
morganPlugin(app);

// Health check
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK", timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({ success: true, message: "LMS API", version: "1.0.0" });
});

// API routes
app.use(env.API_PREFIX, userRoutes);

// Error middleware (must be last)
app.use(errorMiddleware);

// Bootstrap: connect services, then start server
const bootstrap = async () => {
  await connectDatabase();
  await connectRedis();
  await connectCloudinary();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      await disconnectRedis();
      await disconnectCloudinary();
      logger.info("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

bootstrap().catch((err) => {
  logger.error(err, "Failed to start server");
  process.exit(1);
});
