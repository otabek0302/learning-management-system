import { IRouter, Router } from "express";

import { authenticated, authorized } from "@middlewares/auth.middleware";
import { userController } from "./user.controller";
import { validateSignUpByEmail, validateSignUpByPhone, validateSignInByEmail, validateSignInByPhone, validateVerifyOtp, validateResendOtp, validateRefreshToken, validateForgotPassword, validateResetPassword, validateUpdateProfile, validateUpdatePassword, validateUpdatePreferences, validateCourseIdParam, validateUserIdParam, validateCreateUser, validateAdminUpdateUser, validateRestrictAccount, validateListUsersQuery } from "./user.schema";

const router: IRouter = Router();

// ─── Auth (public) ───────────────────────────────────────────────────────────
router.post("/auth/register/email", validateSignUpByEmail, userController.signUpByEmail);
router.post("/auth/register/phone", validateSignUpByPhone, userController.signUpByPhone);
router.post("/auth/verify-otp", validateVerifyOtp, userController.verifyOtp);
router.post("/auth/resend-otp", validateResendOtp, userController.resendOtp);
router.post("/auth/login/email", validateSignInByEmail, userController.signInByEmail);
router.post("/auth/login/phone", validateSignInByPhone, userController.signInByPhone);
router.post("/auth/refresh", validateRefreshToken, userController.refreshToken);
router.post("/auth/forgot-password", validateForgotPassword, userController.forgotPassword);
router.post("/auth/reset-password", validateResetPassword, userController.resetPassword);

// ─── User (authenticated) ────────────────────────────────────────────────────
router.get("/users/me", authenticated, userController.getMe);
router.post("/auth/logout", authenticated, userController.signOut);
router.patch("/users/me", authenticated, validateUpdateProfile, userController.updateProfile);
router.put("/users/me/password", authenticated, validateUpdatePassword, userController.updatePassword);
router.patch("/users/me/preferences", authenticated, validateUpdatePreferences, userController.updatePreferences);

// ─── Student (authenticated) ──────────────────────────────────────────────────
router.post("/users/me/wishlist/:courseId", authenticated, validateCourseIdParam, userController.addToWishlist);
router.delete("/users/me/wishlist/:courseId", authenticated, validateCourseIdParam, userController.removeFromWishlist);

// ─── Admin (order matters: /users/me before /users/:id) ──────────────────────
router.get("/users", authenticated, authorized("admin"), validateListUsersQuery, userController.listUsers);
router.post("/users", authenticated, authorized("admin"), validateCreateUser, userController.createUser);

router.get("/users/:id", authenticated, authorized("admin"), validateUserIdParam, userController.getUserById);
router.patch("/users/:id", authenticated, authorized("admin"), validateAdminUpdateUser, userController.updateUser);
router.delete("/users/:id", authenticated, authorized("admin"), validateUserIdParam, userController.deleteUser);

// ─── Security (admin) ────────────────────────────────────────────────────────
router.post("/users/:id/restrict", authenticated, authorized("admin"), validateRestrictAccount, userController.restrictAccount);
router.post("/users/:id/unrestrict", authenticated, authorized("admin"), validateUserIdParam, userController.unrestrictAccount);

export { router as userRoutes };
