import type { Application } from "express";
import cookieParser from "cookie-parser";

export const cookiePlugin = (app: Application): void => {
  app.use(cookieParser());

  console.log("[Plugin] Cookie parser configured");
};

