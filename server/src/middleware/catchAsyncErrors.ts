import { Request, Response, NextFunction } from "express";

// Middleware to catch errors from async route handlers
const CatchAsyncErrors = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default CatchAsyncErrors;