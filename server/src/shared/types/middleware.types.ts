import type { Request, Response, NextFunction, RequestHandler } from "express";

/** Async request handler type for middleware */
export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

