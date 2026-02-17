import jwt from "jsonwebtoken";
import { env } from "@config/env.config";
import { redis } from "@services/redis.service";
import { UnauthorizedError } from "@middlewares/error.handler";
import { logger } from "@/shared/services/logger.service";

import type { RequestUser } from "@shared/types/express.type";

/** Verify access token */
export const verifyAccessToken = (token: string): RequestUser => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as RequestUser;
    logger.info(`Decoded token: ${JSON.stringify(decoded)}`);
    if (!decoded?._id) {
      throw new UnauthorizedError("Invalid token payload");
    }
    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError("Invalid or expired access token");
  }
};

/** Verify refresh token */
export const verifyRefreshToken = (token: string): RequestUser => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RequestUser;
    if (!decoded?._id) {
      throw new UnauthorizedError("Invalid token payload");
    }
    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
};

/** Get user data from Redis session (throws if missing - use userService.getUserForAuth for fallback) */
export const getUserFromSession = async (userId: string): Promise<RequestUser> => {
  const userData = await redis.getJson<RequestUser>(userId);
  if (!userData) throw new UnauthorizedError("Session expired. Please login again");
  return userData;
};
