import express from "express";
const router = express.Router();

import { activateUser, getUserInfo, loginUser, logoutUser, resgisterUser, socialAuth, updateAccessToken } from "../controller/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

router.post('/registration', resgisterUser);

router.post('/activate-user', activateUser);

router.post('/login-user', loginUser);

router.get('/logout', isAuthenticated, authorizeRoles("admin"), logoutUser);

router.get('/refreshtoken', updateAccessToken);

router.get('/me', isAuthenticated, getUserInfo);

router.post('/social-auth', socialAuth);

export default router;