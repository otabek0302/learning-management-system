import { IRouter, Router } from "express";

import { authenticated, authorized } from "@middlewares/auth.middleware";
import { signUpByEmail, signUpByPhone, verifyOtp, resendOtp, signInByEmail, signInByPhone, signOut, refreshToken, forgotPassword, resetPassword, getMe, updateProfile, updatePassword, updatePreferences, addToWishlist, removeFromWishlist, restrictAccount, unrestrictAccount, createUser, updateUser, deleteUser, getUserById, listUsers } from "./user.controller";
import { validateSignUpByEmail, validateSignUpByPhone, validateSignInByEmail, validateSignInByPhone, validateVerifyOtp, validateResendOtp, validateRefreshToken, validateForgotPassword, validateResetPassword, validateUpdateProfile, validateUpdatePassword, validateUpdatePreferences, validateCourseIdParam, validateUserIdParam, validateCreateUser, validateAdminUpdateUser, validateRestrictAccount, validateListUsersQuery } from "./user.schema";

const router: IRouter = Router();

// ─── Auth (public) ───────────────────────────────────────────────────────────
router.post("/auth/register/email", validateSignUpByEmail, signUpByEmail);
router.post("/auth/register/phone", validateSignUpByPhone, signUpByPhone);
router.post("/auth/verify-otp", validateVerifyOtp, verifyOtp);
router.post("/auth/resend-otp", validateResendOtp, resendOtp);
router.post("/auth/login/email", validateSignInByEmail, signInByEmail);
router.post("/auth/login/phone", validateSignInByPhone, signInByPhone);
router.post("/auth/refresh", validateRefreshToken, refreshToken);
router.post("/auth/forgot-password", validateForgotPassword, forgotPassword);
router.post("/auth/reset-password", validateResetPassword, resetPassword);

// ─── User (authenticated) ────────────────────────────────────────────────────
router.get("/users/me", authenticated, getMe);
router.post("/auth/logout", authenticated, signOut);
router.patch("/users/me", authenticated, validateUpdateProfile, updateProfile);
router.put("/users/me/password", authenticated, validateUpdatePassword, updatePassword);
router.patch("/users/me/preferences", authenticated, validateUpdatePreferences, updatePreferences);

// ─── Student (authenticated) ──────────────────────────────────────────────────
router.post("/users/me/wishlist/:courseId", authenticated, validateCourseIdParam, addToWishlist);
router.delete("/users/me/wishlist/:courseId", authenticated, validateCourseIdParam, removeFromWishlist);

// ─── Admin (order matters: /users/me before /users/:id) ──────────────────────
router.get("/users", authenticated, authorized("admin"), validateListUsersQuery, listUsers);
router.post("/users", authenticated, authorized("admin"), validateCreateUser, createUser);

router.get("/users/:id", authenticated, authorized("admin"), validateUserIdParam, getUserById);
router.patch("/users/:id", authenticated, authorized("admin"), validateAdminUpdateUser, updateUser);
router.delete("/users/:id", authenticated, authorized("admin"), validateUserIdParam, deleteUser);

// ─── Security (admin) ────────────────────────────────────────────────────────
router.post("/users/:id/restrict", authenticated, authorized("admin"), validateRestrictAccount, restrictAccount);
router.post("/users/:id/unrestrict", authenticated, authorized("admin"), validateUserIdParam, unrestrictAccount);

export { router as userRoutes };
