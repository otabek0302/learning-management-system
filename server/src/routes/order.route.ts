import { Router } from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controller/order.controller";

const router = Router();


// Create Order
router.post("/create-order", isAuthenticated, createOrder);

// Admin Routes
// Get All Orders -- Only for Admin
router.get("/get-all-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

export default router;