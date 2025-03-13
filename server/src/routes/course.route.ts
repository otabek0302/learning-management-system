import express from "express";
import { createCourse, updateCourse } from "../controller/course.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/create-course", isAuthenticated, authorizeRoles("admin"), createCourse);

router.put("/update-course/:id", isAuthenticated, authorizeRoles("admin"), updateCourse);

export default router;