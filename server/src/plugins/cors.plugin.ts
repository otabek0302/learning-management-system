import type { Application } from "express";
import { env } from "../config/env";
import cors from "cors";

export const corsPlugin = (app: Application): void => {
  const allowedOrigins = env.ORIGIN.filter((origin) => {
    try {
      if (!origin || origin === "/" || origin === "http://" || origin === "https://") {
        return false;
      }
      new URL(origin);
      return true;
    } catch {
      return false;
    }
  });

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else if (allowedOrigins.length === 0 || origin.includes("localhost") || origin.includes("127.0.0.1")) {
          callback(null, true);
        } else {
          console.warn(`[CORS] Blocked origin: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"],
      exposedHeaders: ["Authorization"],
      optionsSuccessStatus: 200,
    })
  );

  console.log("[Plugin] CORS configured → Allowed Origins:", allowedOrigins.length > 0 ? allowedOrigins : "All localhost origins");
};
