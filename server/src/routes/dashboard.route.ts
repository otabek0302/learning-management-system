import { Router } from "express";
import { getUserAnalytics, getCourseAnalytics, getOrderAnalytics } from "../controller/dashboard.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = Router();

// Get User's Analytics -- Only for Admin
router.get("/user-analytics", isAuthenticated, authorizeRoles("admin"), getUserAnalytics);

// Get Course Analytics -- Only for Admin
router.get("/course-analytics", isAuthenticated, authorizeRoles("admin"), getCourseAnalytics);

// Get Order Analytics -- Only for Admin
router.get("/order-analytics", isAuthenticated, authorizeRoles("admin"), getOrderAnalytics);

export default router;