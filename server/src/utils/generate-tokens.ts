import type { CookieOptions, Response } from "express";
import type { IUser } from "../modules/user/user.interface";
import type { ForgotPasswordTokenData } from "../shared/types";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { redisClient } from "../config/redis";

// Cookie options
export const accessTokenOptions: CookieOptions = {
  expires: new Date(Date.now() + env.ACCESS_TOKEN_EXPIRATION),
  maxAge: env.ACCESS_TOKEN_EXPIRATION,
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
};

export const refreshTokenOptions: CookieOptions = {
  expires: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRATION),
  maxAge: env.REFRESH_TOKEN_EXPIRATION,
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
};

/** Generate tokens and set cookies */
export const generateTokens = async (user: IUser, statusCode: number, res: Response): Promise<void> => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Store session in Redis (expiration in seconds)
  const expirationSeconds = Math.floor(env.REFRESH_TOKEN_EXPIRATION / 1000);
  await redisClient.set(user._id.toString(), JSON.stringify(user.toObject()), {
    ex: expirationSeconds,
  });

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};

/** Generate forgot password token with 4-digit code */
export const generateForgotPasswordToken = (user: { name: string; email: string; _id?: string }): ForgotPasswordTokenData => {
  const forgotPasswordCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      forgotPasswordCode,
    },
    env.FORGOT_PASSWORD_TOKEN_SECRET,
    {
      expiresIn: Math.floor(env.FORGOT_PASSWORD_TOKEN_EXPIRATION / 1000), // Convert to seconds
    }
  );

  return { token, forgotPasswordCode };
};
