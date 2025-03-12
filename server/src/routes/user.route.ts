import express from "express";
const router = express.Router();

import { activateUser, deleteUser, fetchUserById, forgotPassword, getAllUsers, getUserInfo, loginUser, logoutUser, registerUser, resetPassword, searchUsers, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo, verifyForgotPasswordCode } from "../controller/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

router.post('/registration', registerUser);

router.post('/activate-user', activateUser);

router.post('/login-user', loginUser);

router.get('/logout', isAuthenticated, authorizeRoles("admin"), logoutUser);

router.get('/refreshtoken', isAuthenticated, updateAccessToken);

router.get('/me', isAuthenticated, getUserInfo);

router.post('/social-auth', socialAuth);

router.put('/update-user-info', isAuthenticated, updateUserInfo);

router.put('/update-user-password', isAuthenticated, updatePassword);

router.put('/update-user-avatar', isAuthenticated, updateProfilePicture);

router.post('/forgot-password', forgotPassword);

router.post('/verify-forgot-password-code', verifyForgotPasswordCode);

router.post('/reset-password', resetPassword);


// Admin Routes
router.get('/admin/users', isAuthenticated, authorizeRoles("admin"), getAllUsers);

router.get('/admin/user/:id', isAuthenticated, authorizeRoles("admin"), fetchUserById);

router.delete('/admin/user/:id', isAuthenticated, authorizeRoles("admin"), deleteUser);

router.get('/admin/search-users', isAuthenticated, authorizeRoles("admin"), searchUsers);

export default router;