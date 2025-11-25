import express from "express";
import { activateUser, createUser, deleteUser, fetchUserById, forgotPassword, getAllUsers, getUserInfo, loginUser, logoutUser, registerUser, resetPassword, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUser, updateUserInfo, updateUserRole, verifyForgotPasswordCode } from "./user.controller";
import { authenticated, authorized } from "../../middleware/auth.middleware";
import { validateRegister, validateLogin, validateActivation, validateUpdateUserInfo, validateUpdatePassword, validateUpdateAvatar, validateForgotPassword, validateVerifyForgotPassword, validateResetPassword, validateSocialAuth, validateCreateUser, validateUpdateUser, validateUpdateUserRole, validateDeleteUser, validateGetUserById } from "./user.validation";

const router = express.Router();

router.post("/registration", validateRegister, registerUser);
router.post("/activate", validateActivation, activateUser);
router.post("/login", validateLogin, loginUser);
router.get("/logout", authenticated, logoutUser);
router.get("/refreshtoken", updateAccessToken);
router.get("/me", authenticated, getUserInfo);
router.post("/social-auth", validateSocialAuth, socialAuth);
router.put("/update-user-info", authenticated, validateUpdateUserInfo, updateUserInfo);
router.put("/update-user-password", authenticated, validateUpdatePassword, updatePassword);
router.put("/update-user-avatar", authenticated, validateUpdateAvatar, updateProfilePicture);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/verify-forgot-password-code", validateVerifyForgotPassword, verifyForgotPasswordCode);
router.post("/reset-password", validateResetPassword, resetPassword);

router.get("/admin/users", authenticated, authorized("admin"), getAllUsers);
router.get("/admin/get-user/:id", authenticated, authorized("admin"), validateGetUserById, fetchUserById);
router.delete("/admin/delete-user", authenticated, authorized("admin"), validateDeleteUser, deleteUser);
router.put("/admin/update-role", authenticated, authorized("admin"), validateUpdateUserRole, updateUserRole);
router.post("/admin/create-user", authenticated, authorized("admin"), validateCreateUser, createUser);
router.put("/admin/update-user/:id", authenticated, authorized("admin"), validateUpdateUser, updateUser);

export default router;
