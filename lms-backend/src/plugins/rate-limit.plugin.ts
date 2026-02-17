import type { Application } from "express";
import { env } from "@config/env.config";
import rateLimit from "express-rate-limit";

export const rateLimitPlugin = (app: Application): void => {
  app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, max: env.RATE_LIMIT_MAX_REQUESTS, message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." } }));
};
