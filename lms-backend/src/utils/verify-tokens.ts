import jwt from "jsonwebtoken";
import { env } from "@config/env.config";
import { redis } from "@services/redis.service";
import { UnauthorizedError } from "@middlewares/error.handler";

import type { RequestUser } from "@shared/types/express.type";

/** Verify access token */
export const verifyAccessToken = (token: string): RequestUser => {
  const decoded = jwt.verify(token, env.JWT_SECRET) as RequestUser;
  if (!decoded) {
    throw new UnauthorizedError("Invalid token payload");
  }
  return decoded;
};

/** Verify refresh token */
export const verifyRefreshToken = (token: string): RequestUser => {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RequestUser;
  if (!decoded) {
    throw new UnauthorizedError("Invalid token payload");
  }
  return decoded;
};

/** Get user data from Redis session (throws if missing - use userService.getUserForAuth for fallback) */
export const getUserFromSession = async (userId: string): Promise<RequestUser> => {
  const userData = await redis.getJson<RequestUser>(userId);
  if (!userData) throw new UnauthorizedError("Session expired. Please login again");
  return userData;
};
