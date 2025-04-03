import { Router } from "express";
import { createLayout, editLayout, getLayout } from "../controller/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = Router();

// Create Layout
router.post("/create-layout", isAuthenticated, authorizeRoles("admin"), createLayout);

// Edit Layout
router.put("/edit-layout", isAuthenticated, authorizeRoles("admin"), editLayout);

// Get Layout
router.get("/get-layout", getLayout);

export default router;