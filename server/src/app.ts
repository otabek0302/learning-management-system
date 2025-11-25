import type { Application, NextFunction, Request, Response } from "express";
import type { Server } from "http";
import express from "express";

import { env } from "./config/env";
import { corsPlugin, helmetPlugin, morganPlugin, compressionPlugin, cookiePlugin, rateLimitPlugin, securityPlugin } from "./plugins";
import { NotFoundError } from "./shared/errors";
import { ErrorHandler } from "./middleware/error.middleware";
import userRoutes from "./modules/user/user.route";
import categoryRoutes from "./modules/category/category.route";
import layoutRoutes from "./modules/layout/layout.route";
import courseRoutes from "./modules/course/course.route";

export class App {
  private static instance: App;
  private app: Application;
  private server: Server | null = null;

  private constructor() {
    this.app = express();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  public registerMiddlewares(): void {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  public registerPlugins(): void {
    corsPlugin(this.app);
    securityPlugin(this.app);
    helmetPlugin(this.app);
    cookiePlugin(this.app);
    compressionPlugin(this.app);
    rateLimitPlugin(this.app);
    morganPlugin(this.app);
  }

  public registerRoutes(): void {
    this.app.get("/health", (req: Request, res: Response) => {
      res.status(200).json({ message: "Server is running" });
    });

    this.app.use("/api/v1/user", userRoutes);
    this.app.use("/api/v1/categories", categoryRoutes);
    this.app.use("/api/v1/layout", layoutRoutes);
    this.app.use("/api/v1/courses", courseRoutes);

    this.app.all("*", (req: Request, _res: Response, next: NextFunction) => {
      const err = new NotFoundError("Route", undefined, { url: req.url });
      next(err);
    });
  }

  public registerErrorHandler(): void {
    this.app.use(ErrorHandler);
  }

  public async connect(): Promise<void> {
    this.registerMiddlewares();
    this.registerPlugins();
    this.registerRoutes();
    this.registerErrorHandler();

    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(env.PORT, () => {
          console.log(`[Server] Server running → http://localhost:${env.PORT}`);
          resolve();
        });

        this.server.on("error", (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err) => {
        if (err) {
          console.error("[Server] Error closing server:", err);
          reject(err);
        } else {
          console.log("[Server] Server closed");
          resolve();
        }
      });
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export const app = App.getInstance();
