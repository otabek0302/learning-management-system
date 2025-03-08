import express from "express";
const router = express.Router();

import { activateUser, getUserInfo, loginUser, logoutUser, registerUser, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo } from "../controller/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

router.post('/registration', registerUser);

router.post('/activate-user', activateUser);

router.post('/login-user', loginUser);

router.get('/logout', isAuthenticated, authorizeRoles("admin"), logoutUser);

router.get('/refreshtoken', updateAccessToken);

router.get('/me', isAuthenticated, getUserInfo);

router.post('/social-auth', socialAuth);

router.put('/update-user-info', isAuthenticated, updateUserInfo);

router.put('/update-user-password', isAuthenticated, updatePassword);

router.put('/update-user-avatar', isAuthenticated, updateProfilePicture);

export default router;