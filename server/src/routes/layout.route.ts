import { Router } from "express";
import { createLayout, editLayout, getLayout, getLayoutById, getAllLayouts, deleteLayout } from "../controller/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = Router();

// Create Layout
router.post("/create-layout", isAuthenticated, authorizeRoles("admin"), createLayout);

// Edit Layout
router.put("/edit-layout/:id", isAuthenticated, authorizeRoles("admin"), editLayout);

// Delete Layout
router.delete("/delete-layout/:id", isAuthenticated, authorizeRoles("admin"), deleteLayout);

// Get Layout
router.get("/get-layout/:type", getLayout);

// Get Layout By ID
router.get("/get-layout-by-id/:id", getLayoutById);

// Get All Layouts
router.get("/get-all-layouts", isAuthenticated, authorizeRoles("admin"), getAllLayouts);

export default router;