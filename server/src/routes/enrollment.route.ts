import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { enrollCourse, getMyEnrollments } from "../controller/enrollment.controller";

const router = express.Router();

router.post("/enroll", isAuthenticated, enrollCourse);
router.get("/my", isAuthenticated, getMyEnrollments);

export default router;
