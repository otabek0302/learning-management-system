import type { Request, Response, NextFunction } from "express";
import { AsyncFunction } from "./async.middleware";
import { verifyAccessToken, getUserFromSession } from "../utils/verify-tokens";
import { AuthenticationError, AuthorizationError } from "../shared/errors";

import UserModel from "../modules/user/user.model";

/** Authentication middleware - checks if user is authenticated */
export const authenticated = AsyncFunction(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.cookies.access_token as string | undefined;

  if (!accessToken) {
    throw new AuthenticationError("Please login to access this resource");
  }

  const decoded = verifyAccessToken(accessToken);
  
  try {
    const user = await getUserFromSession(decoded.id);
    req.user = user;
  } catch (error) {
    const dbUser = await UserModel.findById(decoded.id).select("-password").lean();
    if (!dbUser) {
      throw new AuthenticationError("User not found. Please login again");
    }
    req.user = dbUser as any;
  }

  next();
});

/** Authorization middleware - checks if user has required roles */
export const authorized = (...roles: string[]) => {
  return AsyncFunction(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      throw new AuthorizationError(`Role '${userRole}' is not allowed to access this resource`);
    }
    next();
  });
};