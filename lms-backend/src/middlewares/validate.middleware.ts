import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "@middlewares/error.handler";

export const validate = (schema: z.ZodSchema, source: "query" | "params" | "body" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === "query" ? req.query : source === "params" ? req.params : req.body;
      const parsed = schema.parse(data);
      
      // Assign transformed values back to request object
      if (source === "query") {
        Object.assign(req.query, parsed);
      } else if (source === "params") {
        Object.assign(req.params, parsed);
      } else {
        Object.assign(req.body, parsed);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        next(new ValidationError("Validation failed", { errors }));
      } else {
        next(new ValidationError("Invalid request data"));
      }
    }
  };
};
