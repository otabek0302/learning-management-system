import type { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "@middlewares/error.handler";
import { isDevelopment } from "@config/env.config";
import { logger } from "@shared/services/logger.service";

export const errorMiddleware = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  // Handle operational errors (known errors)
  if (err instanceof ErrorHandler) {
    const response: { success: boolean; message: string; status: string; status_code: number; data?: Record<string, unknown>; stack?: string } = { success: false, message: err.message, status: err.name, status_code: err.statusCode };

    // Include additional data if provided
    if (err.data) {
      response.data = err.data;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle programming errors (unknown errors)
  const response: { success: boolean; message: string; status_code: number; stack?: string } = {
    success: false,
    message: isDevelopment && err instanceof Error ? err.message : "Internal server error",
    status_code: 500,
  };

  if (isDevelopment && err instanceof Error && err.stack) {
    response.stack = err.stack;
  }

  // Log unexpected errors at error level with full context
  logger.error(
    {
      error_message: err instanceof Error ? err.message : String(err),
      error_stack: err instanceof Error ? err.stack : undefined,
      request_url: req.url,
      request_method: req.method,
      request_body: req.body,
      request_query: req.query,
      request_params: req.params,
      request_ip: req.ip,
      request_user_agent: req.get("user-agent"),
    },
    "Unexpected error occurred"
  );

  res.status(500).json(response);
};
