import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { completeLesson, getCourseProgress } from "../controller/progress.controller";

const router = express.Router();

router.post("/complete", isAuthenticated, completeLesson);
router.get("/course/:courseId", isAuthenticated, getCourseProgress);

export default router;
