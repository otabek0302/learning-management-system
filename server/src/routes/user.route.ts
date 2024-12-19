import express from "express";
const router = express.Router();

import { activateUser, resgisterUser } from "../controller/user.controller";

router.post('/registration', resgisterUser);
router.post('/activate-user', activateUser);

export default router;