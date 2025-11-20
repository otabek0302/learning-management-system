import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import {
  getUserAnalytics,
  getCourseAnalytics,
  getOrderAnalytics,
  getRevenueStats,
  getUserStats,
  getCourseStats,
  getQuizStats,
  getCouponStats,
  getAdminDashboardStats
} from "../controller/analytic.controller";

const router = express.Router();

// Legacy analytics endpoints (for charts)
router.get("/user-analytics", isAuthenticated, authorizeRoles("admin"), getUserAnalytics);
router.get("/course-analytics", isAuthenticated, authorizeRoles("admin"), getCourseAnalytics);
router.get("/order-analytics", isAuthenticated, authorizeRoles("admin"), getOrderAnalytics);

// Stats endpoints
router.get("/revenue", isAuthenticated, authorizeRoles("admin"), getRevenueStats);
router.get("/users", isAuthenticated, authorizeRoles("admin"), getUserStats);
router.get("/courses", isAuthenticated, authorizeRoles("admin"), getCourseStats);
router.get("/quizzes", isAuthenticated, authorizeRoles("admin"), getQuizStats);
router.get("/coupons", isAuthenticated, authorizeRoles("admin"), getCouponStats);

// Full dashboard summary
router.get("/dashboard", isAuthenticated, authorizeRoles("admin"), getAdminDashboardStats);



export default router;