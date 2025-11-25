import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { redisClient } from "../config/redis";
import { AuthenticationError } from "../shared/errors";
import type { JwtPayload, ForgotPasswordTokenPayload } from "../shared/types";

/** Verify access token */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN) as JwtPayload;
    if (!decoded?.id) {
      throw new AuthenticationError("Invalid token payload");
    }
    return decoded;
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    throw new AuthenticationError("Invalid or expired access token");
  }
};

/** Verify refresh token */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.REFRESH_TOKEN) as JwtPayload;
    if (!decoded?.id) {
      throw new AuthenticationError("Invalid token payload");
    }
    return decoded;
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    throw new AuthenticationError("Invalid or expired refresh token");
  }
};

/** Get user data from Redis session */
export const getUserFromSession = async (userId: string): Promise<any> => {
  const userData = await redisClient.get<string>(userId);

  if (!userData) {
    throw new AuthenticationError("Session expired. Please login again");
  }

  try {
    return typeof userData === "string" ? JSON.parse(userData) : userData;
  } catch (error) {
    throw new AuthenticationError("Failed to parse user session data");
  }
};

/** Verify forgot password token */
export const verifyForgotPasswordToken = (token: string, code: string): ForgotPasswordTokenPayload => {
  try {
    const decoded = jwt.verify(token, env.FORGOT_PASSWORD_TOKEN_SECRET) as ForgotPasswordTokenPayload;

    if (!decoded?.user?.email || !decoded?.forgotPasswordCode) {
      throw new AuthenticationError("Invalid token payload");
    }

    if (decoded.forgotPasswordCode !== code) {
      throw new AuthenticationError("Invalid forgot password code");
    }

    return decoded;
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    throw new AuthenticationError("Invalid or expired forgot password token");
  }
};
