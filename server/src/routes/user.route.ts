import express from "express";
const router = express.Router();

import { activateUser, loginUser, logoutUser, resgisterUser } from "../controller/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

router.post('/registration', resgisterUser);

router.post('/activate-user', activateUser);

router.post('/login-user', loginUser);

router.get('/logout', isAuthenticated, authorizeRoles("admin"), logoutUser);

export default router;