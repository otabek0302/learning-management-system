import type { Request, Response, RequestHandler } from "express";
import type { RequestUser } from "@/shared/types/express.type";
import type { ISignUpByEmail, ISignUpByPhone, ISignInByEmail, ISignInByPhone, IVerifyOtp, IResendOtp, IRefreshToken, IForgotPassword, IResetPassword, IUpdateProfile, IUpdatePassword, IUpdatePreferences, ICreateUser, IAdminUpdateUser, IListUsersQuery } from "./user.interface";
import { Types as MongooseTypes } from "mongoose";

import { asyncHandler } from "@middlewares/async.handler";
import { NotFoundError, UnauthorizedError } from "@middlewares/error.handler";
import { clearAuthCookies, setAccessTokenCookie, setAuthCookies } from "@utils/auth-cookies";
import { verifyRefreshToken } from "@/utils/verify-tokens";
import { userService } from "./user.service";

// ─── Auth ───────────────────────────────────────────────────────────────────
const signUpByEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as ISignUpByEmail;
  const result = await userService.signUpByEmail(data);
  const status = "requiresVerification" in result ? 200 : 201;
  res.status(status).json({ success: true, data: result });
});

const signUpByPhone = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as ISignUpByPhone;
  const result = await userService.signUpByPhone(data);
  const status = "requiresVerification" in result ? 200 : 201;
  res.status(status).json({ success: true, data: result });
});

const verifyOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IVerifyOtp;
  const result = await userService.verifyOtp(data);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ success: true, data: result });
});

const resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IResendOtp;
  const result = await userService.resendOtp(data);
  res.json({ success: true, data: result });
});

const signInByEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as ISignInByEmail;
  const ip = req.ip ?? req.socket?.remoteAddress;
  const result = await userService.signInByEmail(email, password, ip);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ success: true, data: result });
});

const signInByPhone = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body as ISignInByPhone;
  const ip = req.ip ?? req.socket?.remoteAddress;
  const result = await userService.signInByPhone(phone, password, ip);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ success: true, data: result });
});

const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = req.body as IRefreshToken;
  const token = (req.cookies.refresh_token as string | undefined) ?? body.refreshToken;
  if (!token) throw new UnauthorizedError("Refresh token required");
  verifyRefreshToken(token);
  const accessToken = await userService.refreshToken(token);
  setAccessTokenCookie(res, accessToken);
  res.json({ success: true, data: { accessToken } });
});

const signOut = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = String((req.user as RequestUser)!._id);
  const refreshToken = req.cookies.refresh_token as string | undefined;
  await userService.signOut(userId, refreshToken);
  clearAuthCookies(res);
  res.json({ success: true, message: "Logged out successfully" });
});

const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IForgotPassword;
  const result = await userService.forgotPassword(data);
  res.json({ success: true, data: result });
});

const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IResetPassword;
  const result = await userService.resetPassword(data);
  res.json({ success: true, data: result });
});

// ─── Profile ─────────────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = String((req.user as RequestUser)!._id);
  const user = await userService.getMe(userId);
  if (!user) throw new NotFoundError("User not found");
  res.json({ success: true, data: user });
});

const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = String((req.user as RequestUser)!._id);
  const data = req.body as IUpdateProfile;
  const user = await userService.updateProfile(userId, data);
  res.json({ success: true, data: user });
});

const updatePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = String((req.user as RequestUser)!._id);
  const { oldPassword, newPassword } = req.body as IUpdatePassword;
  await userService.updatePassword(userId, oldPassword, newPassword);
  res.json({ success: true, message: "Password updated successfully" });
});

// ─── Preferences ─────────────────────────────────────────────────────────────
const updatePreferences = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = String((req.user as RequestUser)!._id);
  const data = req.body as IUpdatePreferences;
  const user = await userService.updatePreferences(userId, data);
  res.json({ success: true, data: user });
});

// ─── Student ─────────────────────────────────────────────────────────────────
const addToWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = String((req.user as RequestUser)!._id);
  const { courseId } = req.params as { courseId: string };
  const courseIdObj = new MongooseTypes.ObjectId(courseId);
  await userService.addToWishlist(userId, courseIdObj);
  res.json({ success: true, message: "Added to wishlist" });
});

const removeFromWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = String((req.user as RequestUser)!._id);
  const { courseId } = req.params as { courseId: string };
  const courseIdObj = new MongooseTypes.ObjectId(courseId);
  await userService.removeFromWishlist(userId, courseIdObj);
  res.json({ success: true, message: "Removed from wishlist" });
});

// ─── Security ────────────────────────────────────────────────────────────────
const restrictAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const { reason } = req.body as { reason: string };
  await userService.restrictAccount(id, reason);
  res.json({ success: true, message: "Account restricted" });
});

const unrestrictAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  await userService.unrestrictAccount(id);
  res.json({ success: true, message: "Account unrestricted" });
});

// ─── Admin ───────────────────────────────────────────────────────────────────
const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as ICreateUser;
  const user = await userService.createUser(data);
  res.status(201).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const data = req.body as IAdminUpdateUser;
  const user = await userService.updateUser(id, data);
  res.json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  await userService.deleteUser(id);
  res.json({ success: true, message: "User deleted" });
});

const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const user = await userService.getUserById(id);
  if (!user) throw new NotFoundError("User not found");
  res.json({ success: true, data: user });
});

const listUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const options = req.query as IListUsersQuery;
  const result = await userService.listUsers(options);
  res.json({ success: true, data: result });
});

type UserController = Record<string, RequestHandler>;

export const userController: UserController = {
  signUpByEmail,
  signUpByPhone,
  verifyOtp,
  resendOtp,
  signInByEmail,
  signInByPhone,
  signOut,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  updatePassword,
  updatePreferences,
  addToWishlist,
  removeFromWishlist,
  restrictAccount,
  unrestrictAccount,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  listUsers,
};
