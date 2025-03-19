import express from "express";
import { createCourse, getAllCourses, getCourseByUser, getSingleCourse, updateCourse, addComment, addReplyToComment, addReview, replyToReview } from "../controller/course.controller";
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

// Add Comment in Course
router.put("/add-comment", isAuthenticated, addComment);

// Add Reply to Comment in Course
router.put("/reply-comment", isAuthenticated, addReplyToComment);

// Add Review in Course
router.put("/add-review/:id", isAuthenticated, addReview);

// Reply to Review in Course
router.put("/reply-review", isAuthenticated, authorizeRoles("admin"), replyToReview);

export default router;