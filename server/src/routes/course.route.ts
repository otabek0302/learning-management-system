import express from "express";
import { createCourse, getSingleCourse, updateCourse } from "../controller/course.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/create-course", isAuthenticated, authorizeRoles("admin"), createCourse);

router.put("/update-course/:id", isAuthenticated, authorizeRoles("admin"), updateCourse);

router.get("/get-single-course/:id", getSingleCourse);

export default router;