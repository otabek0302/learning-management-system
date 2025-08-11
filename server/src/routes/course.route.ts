import express from "express";
import { createCourse, getAllCourses, getAllCoursesAdmin, getCourseByUser, getSingleCourse, getSingleCourseAdmin, updateCourse, addComment, addReplyToComment, addReview, replyToReview, deleteCourse, generateVideoUrlController } from "../controller/course.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

// Create Course -- Only for Admin
router.post("/admin/create-course", isAuthenticated, authorizeRoles("admin"), createCourse);

// Update Course -- Only for Admin
router.put("/admin/update-course/:id", isAuthenticated, authorizeRoles("admin"), updateCourse);

// Get Single Course
router.get("/get-single-course/:id", getSingleCourse);

// Get Single Course for Admin - Full data for editing
router.get("/admin/get-single-course/:id", isAuthenticated, authorizeRoles("admin"), getSingleCourseAdmin);

// Get All Courses
router.get("/get-all-courses", getAllCourses);

// Get All Courses -- Admin
router.get("/admin/get-all-courses", isAuthenticated, authorizeRoles("admin"), getAllCoursesAdmin);

// Get Course Content
router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

// Add Comment in Course
router.put("/add-comment", isAuthenticated, addComment);

// Add Reply to Comment in Course
router.put("/reply-comment", isAuthenticated, addReplyToComment);

// Add Review in Course
router.put("/add-review/:id", isAuthenticated, addReview);

// Reply to Review in Course -- Only for Admin
router.put("/admin/reply-review", isAuthenticated, authorizeRoles("admin"), replyToReview);

// Generate Video Url
router.post("/generate-video-otp", generateVideoUrlController);

// Delete Course -- Only for Admin
router.delete("/admin/delete-course", isAuthenticated, authorizeRoles("admin"), deleteCourse);

export default router;