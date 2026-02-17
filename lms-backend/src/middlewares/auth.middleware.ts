import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { RequestUser } from "@shared/types/express.type";

import { asyncHandler } from "@middlewares/async.handler";
import { ForbiddenError, UnauthorizedError } from "@middlewares/error.handler";
import { userService } from "@/modules/user/user.service";
import { verifyAccessToken } from "@utils/verify-tokens";

/** Authentication middleware - checks if user is authenticated */
export const authenticated: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.cookies.access_token as string | undefined;

  if (!accessToken) {
    throw new UnauthorizedError("Please login to access this resource");
  }

  const decoded = verifyAccessToken(accessToken);
  req.user = await userService.getUserForAuth(String(decoded._id));

  next();
});

/** Authorization middleware - checks if user has required roles */
export const authorized = (...roles: string[]): RequestHandler => {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as RequestUser | undefined;
    const userRole = user?.role;
    if (!userRole || !roles.includes(userRole)) {
      throw new ForbiddenError(`Role '${userRole}' is not allowed to access this resource`);
    }
    next();
  });
};
