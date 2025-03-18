import express from "express";
import { createCourse, getAllCourses, getCourseByUser, getSingleCourse, updateCourse } from "../controller/course.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

// Create Course
router.post("/create-course", isAuthenticated, authorizeRoles("admin"), createCourse);

// Update Course
router.put("/update-course/:id", isAuthenticated, authorizeRoles("admin"), updateCourse);

// Get Single Course
router.get("/get-single-course/:id", getSingleCourse);

// Get All Courses
router.get("/get-all-courses", getAllCourses);

// Get Course Content
router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

export default router;