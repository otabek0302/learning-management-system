import type { Request, Response, RequestHandler } from "express";

import { asyncHandler } from "@middlewares/async.handler";
import { UnauthorizedError } from "@middlewares/error.handler";
import { clearAuthCookies, setAccessTokenCookie, setAuthCookies } from "@utils/auth-cookies";
import { userService } from "./user.service";
import { RequestUser } from "@/shared/types/express.type";

// ─── Auth ───────────────────────────────────────────────────────────────────
const signUpByEmail: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.signUpByEmail(req.body);
  res.status(201).json({ success: true, data: result });
});

const signUpByPhone: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.signUpByPhone(req.body);
  res.status(201).json({ success: true, data: result });
});

const verifyOtp: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.verifyOtp(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ success: true, data: result });
});

const resendOtp: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.resendOtp(req.body);
  res.json({ success: true, data: result });
});

const signInByEmail: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.signInByEmail(req.body, req);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ success: true, data: result });
});

const signInByPhone: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.signInByPhone(req.body, req);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ success: true, data: result });
});

const refreshToken: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const accessToken = await userService.refreshToken(req.cookies.refresh_token);
  setAccessTokenCookie(res, accessToken);
  res.json({ success: true, data: { accessToken } });
});

const signOut: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await userService.signOut(req?.user as RequestUser, req.cookies.refresh_token);
  clearAuthCookies(res);
  res.json({ success: true, message: "Logged out successfully" });
});

const forgotPassword: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.forgotPassword(req.body);
  res.json({ success: true, data: result });
});

const resetPassword: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.resetPassword(req.body);
  res.json({ success: true, data: result });
});

// ─── Profile ─────────────────────────────────────────────────────────────────
const getMe: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getMe(req?.user as RequestUser);
  res.json({ success: true, data: user });
});

const updateProfile: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.updateProfile(req?.user as RequestUser, req.body);
  res.json({ success: true, data: user });
});

const updatePassword: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await userService.updatePassword(req?.user as RequestUser, req.body);
  res.json({ success: true, message: "Password updated successfully" });
});

// ─── Preferences ─────────────────────────────────────────────────────────────
const updatePreferences: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.updatePreferences(req?.user as RequestUser, req.body);
  res.json({ success: true, data: user });
});

// ─── Student ─────────────────────────────────────────────────────────────────
const addToWishlist: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await userService.addToWishlist(req?.user as RequestUser, req.params.courseId as string);
  res.json({ success: true, message: "Added to wishlist" });
});

const removeFromWishlist: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await userService.removeFromWishlist(req?.user as RequestUser, req.params.courseId as string);
  res.json({ success: true, message: "Removed from wishlist" });
});

// ─── Security ────────────────────────────────────────────────────────────────
const restrictAccount: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await userService.restrictAccount(req.params.id as string, req.body.reason as string);
  res.json({ success: true, message: "Account restricted" });
});

const unrestrictAccount: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await userService.unrestrictAccount(req.params.id as string);
  res.json({ success: true, message: "Account unrestricted" });
});

// ─── Admin ───────────────────────────────────────────────────────────────────
const createUser: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

const updateUser: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.updateUser(req.params.id as string, req.body);
  res.json({ success: true, data: user });
});

const deleteUser: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await userService.deleteUser(req.params.id as string);
  res.json({ success: true, message: "User deleted" });
});

const getUserById: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUserById(req.params.id as string);
  res.json({ success: true, data: user });
});

const listUsers: RequestHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.listUsers(req.query);
  res.json({ success: true, data: result });
});

export { signUpByEmail, signUpByPhone, verifyOtp, resendOtp, signInByEmail, signInByPhone, signOut, refreshToken, forgotPassword, resetPassword, getMe, updateProfile, updatePassword, updatePreferences, addToWishlist, removeFromWishlist, restrictAccount, unrestrictAccount, createUser, updateUser, deleteUser, getUserById, listUsers };
