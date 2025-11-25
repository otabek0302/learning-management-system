import express from "express";
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from "./course.controller";
import { authenticated, authorized } from "../../middleware/auth.middleware";
import { validateCreateCourse, validateUpdateCourse, validateGetCourseById, validateDeleteCourse, validateGetCoursesQuery } from "./course.validation";

const router = express.Router();

// Admin routes
router.get("/admin/get-all-courses", authenticated, authorized("admin"), validateGetCoursesQuery, getAllCourses);
router.get("/admin/get-single-course/:id", authenticated, authorized("admin"), validateGetCourseById, getCourseById);
router.post("/admin/create-course", authenticated, authorized("admin"), validateCreateCourse, createCourse);
router.put("/admin/update-course/:id", authenticated, authorized("admin"), validateUpdateCourse, updateCourse);
router.delete("/admin/delete-course", authenticated, authorized("admin"), validateDeleteCourse, deleteCourse);

export default router;
