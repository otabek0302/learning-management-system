import type { Application } from "express";
import { env } from "@config/env.config";
import helmet from "helmet";

export const helmetPlugin = (app: Application): void => {
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === "production" ? false : undefined,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
};
