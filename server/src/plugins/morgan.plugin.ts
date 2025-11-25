import type { Application } from "express";
import morgan from "morgan";
import { env } from "../config/env";

export const morganPlugin = (app: Application): void => {
  const format = env.NODE_ENV === "production" ? "combined" : "dev";

  app.use(
    morgan(format, {
      skip: (req, _res) => {
        if (env.NODE_ENV === "production" && req.url === "/health") {
          return true;
        }
        return false;
      },
    })
  );

  console.log(`[Plugin] Morgan logging configured → Format: ${format}`);
};
