import express from "express";
const router = express.Router();

import { activateUser, loginUser, logoutUser, resgisterUser } from "../controller/user.controller";

router.post('/registration', resgisterUser);

router.post('/activate-user', activateUser);

router.post('/login-user', loginUser);

router.get('/logout', logoutUser);

export default router;