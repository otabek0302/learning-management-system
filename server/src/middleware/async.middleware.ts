import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { AsyncRequestHandler } from "../shared/types";

export const AsyncFunction = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default AsyncFunction;