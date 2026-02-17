import type { Application } from "express";
import compression from "compression";

export const compressionPlugin = (app: Application): void => {
  app.use(compression({ level: 6, threshold: 1024 }));
};
