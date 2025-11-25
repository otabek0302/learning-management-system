import type { Application } from "express";
import rateLimit from "express-rate-limit";

export const rateLimitPlugin = (app: Application): void => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: "Too many requests from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);

  console.log("[Plugin] Rate limiting configured → 100 requests per 15 minutes (in-memory)");
};
