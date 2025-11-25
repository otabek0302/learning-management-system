import type { Application } from "express";
import helmet from "helmet";
import { env } from "../config/env";

export const helmetPlugin = (app: Application): void => {
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === "production" ? undefined : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  console.log("[Plugin] Helmet security headers configured");
};

