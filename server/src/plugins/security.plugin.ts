import type { Application } from "express";
import { env } from "../config/env";

export const securityPlugin = (app: Application): void => {
  app.disable("x-powered-by");

  if (env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    next();
  });

  console.log("[Plugin] Security headers configured");
};
