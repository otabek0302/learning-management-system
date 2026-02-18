import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { RequestUser } from "@shared/types/express.type";

import { asyncHandler } from "@middlewares/async.handler";
import { ForbiddenError, UnauthorizedError } from "@middlewares/error.handler";
import { verifyAccessToken } from "@utils/verify-tokens";

/** Authentication middleware - checks if user is authenticated */
export const authenticated: RequestHandler = asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  if (!req.cookies.access_token) {
    throw new UnauthorizedError("Please login to access this resource");
  }

  const decoded = verifyAccessToken(req.cookies.access_token);
  const user = { _id: decoded._id, role: decoded.role, email: decoded.email, phone: decoded.phone };

  req.user = { _id: user._id, role: user.role, email: user.email, phone: user.phone };

  next();
});

/** Authorization middleware - checks if user has required roles */
export const authorized = (...roles: string[]): RequestHandler => {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!(req.user as RequestUser)?.role) {
      throw new UnauthorizedError("Please login to access this resource");
    }
    if (!roles.includes((req.user as RequestUser)?.role)) {
      throw new ForbiddenError(`Role '${(req.user as RequestUser)?.role}' is not allowed to access this resource`);
    }
    next();
  });
};
