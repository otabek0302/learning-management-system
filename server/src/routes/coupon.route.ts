import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { createCoupon, getCoupons, applyCoupon } from "../controller/coupon.controller";

const router = express.Router();

router.post("/", isAuthenticated, authorizeRoles("admin"), createCoupon);
router.get("/", isAuthenticated, authorizeRoles("admin"), getCoupons);
router.post("/apply", isAuthenticated, applyCoupon);

export default router;
