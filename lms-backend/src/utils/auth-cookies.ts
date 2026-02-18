import type { Response } from "express";

import { isProduction } from "@config/env.config";
import { env } from "@config/env.config";

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie("access_token", accessToken, { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/", maxAge: env.JWT_EXPIRES_IN * 1000 });
  res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/", maxAge: env.JWT_REFRESH_EXPIRES_IN * 1000 });
};

export const setAccessTokenCookie = (res: Response, accessToken: string): void => {
  res.cookie("access_token", accessToken, { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/", maxAge: env.JWT_EXPIRES_IN * 1000 });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("access_token", { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/" });
  res.clearCookie("refresh_token", { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/" });
};
