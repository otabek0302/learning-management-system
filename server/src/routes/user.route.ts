import express from "express";
const router = express.Router();

import { activateUser, deleteUser, fetchUserById, forgotPassword, getAllUsers, getUserInfo, loginUser, logoutUser, registerUser, resetPassword, searchUsers, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo, verifyForgotPasswordCode } from "../controller/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

// User Routes
router.post('/registration', registerUser);

// Activate User
router.post('/activate-user', activateUser);

// Login User
router.post('/login-user', loginUser);

// Logout User
router.get('/logout', isAuthenticated, authorizeRoles("admin"), logoutUser);

// Refresh Token
router.get('/refreshtoken', isAuthenticated, updateAccessToken);

// Get User Info
router.get('/me', isAuthenticated, getUserInfo);

// Social Auth
router.post('/social-auth', socialAuth);

// Update User Info
router.put('/update-user-info', isAuthenticated, updateUserInfo);

// Update User Password
router.put('/update-user-password', isAuthenticated, updatePassword);

// Update User Avatar
router.put('/update-user-avatar', isAuthenticated, updateProfilePicture);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Verify Forgot Password Code
router.post('/verify-forgot-password-code', verifyForgotPasswordCode);

// Reset Password
router.post('/reset-password', resetPassword);


// Admin Routes
router.get('/admin/users', isAuthenticated, authorizeRoles("admin"), getAllUsers);

router.get('/admin/user/:id', isAuthenticated, authorizeRoles("admin"), fetchUserById);

router.delete('/admin/user/:id', isAuthenticated, authorizeRoles("admin"), deleteUser);

router.get('/admin/search-users', isAuthenticated, authorizeRoles("admin"), searchUsers);

export default router;