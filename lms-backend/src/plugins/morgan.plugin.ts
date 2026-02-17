import type { Application } from "express";
import { env } from "@config/env.config";
import morgan from "morgan";

export const morganPlugin = (app: Application): void => {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
};
