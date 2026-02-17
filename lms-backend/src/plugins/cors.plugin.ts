import type { Application } from "express";
import { env } from "@config/env.config";
import cors from "cors";

export const corsPlugin = (app: Application): void => {
  app.use(
    cors({
      origin: env.CORS_ORIGIN ?? "*",
      credentials: env.CORS_CREDENTIALS ?? true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"],
      exposedHeaders: ["Authorization"],
      optionsSuccessStatus: 200,
    })
  );
};
