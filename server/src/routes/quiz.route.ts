import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { submitQuiz } from "../controller/quiz.controller";

const router = express.Router();

router.post("/submit", isAuthenticated, submitQuiz);

export default router;
