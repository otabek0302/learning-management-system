import type { Application } from "express";
import compression from "compression";

export const compressionPlugin = (app: Application): void => {
  app.use(
    compression({
      level: 6, // Compression level (0-9, 6 is a good balance)
      threshold: 1024, // Only compress responses larger than 1KB
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) return false;
        return compression.filter(req, res);
      },
    })
  );

  console.log("[Plugin] Compression middleware configured");
};
