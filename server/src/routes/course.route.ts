import express from "express";
import { createCourse, getAllCourses, getAllCoursesAdmin, getCourseByUser, getSingleCourse, updateCourse, addComment, addReplyToComment, addReview, replyToReview } from "../controller/course.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

// Create Course -- Only for Admin
router.post("/create-course", isAuthenticated, authorizeRoles("admin"), createCourse);

// Update Course -- Only for Admin
router.put("/update-course/:id", isAuthenticated, authorizeRoles("admin"), updateCourse);

// Get Single Course
router.get("/get-single-course/:id", getSingleCourse);

// Get All Courses
router.get("/get-all-courses", getAllCourses);

// Get All Courses -- Admin
router.get("/get-all-courses-admin", isAuthenticated, authorizeRoles("admin"), getAllCoursesAdmin);

// Get Course Content
router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

// Add Comment in Course
router.put("/add-comment", isAuthenticated, addComment);

// Add Reply to Comment in Course
router.put("/reply-comment", isAuthenticated, addReplyToComment);

// Add Review in Course
router.put("/add-review/:id", isAuthenticated, addReview);

// Reply to Review in Course -- Only for Admin
router.put("/reply-review", isAuthenticated, authorizeRoles("admin"), replyToReview);

export default router;