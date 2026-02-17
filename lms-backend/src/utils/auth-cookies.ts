import type { Response } from "express";

import { isProduction } from "@config/env.config";

const ACCESS_TOKEN_MAX_AGE = 3 * 60 * 60; // 3 hours in seconds
const REFRESH_TOKEN_MAX_AGE = 3 * 24 * 60 * 60; // 3 days in seconds

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie("access_token", accessToken, { ...baseCookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE * 1000 });
  res.cookie("refresh_token", refreshToken, { ...baseCookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE * 1000 });
};

export const setAccessTokenCookie = (res: Response, accessToken: string): void => {
  res.cookie("access_token", accessToken, { ...baseCookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE * 1000 });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("access_token", baseCookieOptions);
  res.clearCookie("refresh_token", baseCookieOptions);
};
