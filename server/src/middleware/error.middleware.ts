import type { Request, Response, NextFunction } from "express";
import { BaseError } from "../shared/errors/base.error";
import { env } from "../config/env";

const setCorsHeaders = (req: Request, res: Response): void => {
  const origin = req.headers.origin;
  const allowedOrigins = env.ORIGIN;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Cookie");
  } else if (!origin || origin === "null") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
};

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  setCorsHeaders(req, res);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof BaseError) {
    res.status(err.status_code).json({
      success: false,
      error: err.toJSON(),
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  console.error("[Error] Unhandled error:", err);
  if (err.stack) {
    console.error("[Error] Stack:", err.stack);
  }

  res.status(500).json({
    success: false,
    error: {
      name: "InternalServerError",
      message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
      error_code: "INTERNAL_SERVER_ERROR",
      status_code: 500,
      timestamp: new Date().toISOString(),
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};
