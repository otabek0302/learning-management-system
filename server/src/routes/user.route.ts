import express from "express";
const router = express.Router();

import { activateUser, loginUser, resgisterUser } from "../controller/user.controller";

router.post('/registration', resgisterUser);
router.post('/activate-user', activateUser);
router.post('/login-user', loginUser);

export default router;