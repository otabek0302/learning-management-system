import express from "express";
const router = express.Router();

import { resgisterUser } from "../controller/user.controller";

router.post('/registration', resgisterUser);

export default router;