import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { authorizeRoles } from "../middleware/auth";
import {
    getAllCategoriesController,
    getCategoryByIdController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController
} from "../controller/category.controller";

const categoryRouter = express.Router();

// Get all categories (public)
categoryRouter.get("/get-all-categories", getAllCategoriesController);

// Get single category (public)
categoryRouter.get("/get-category/:id", getCategoryByIdController);

// Create category (admin only)
categoryRouter.post("/create-category", isAuthenticated, authorizeRoles("admin"), createCategoryController);

// Update category (admin only)
categoryRouter.put("/update-category/:id", isAuthenticated, authorizeRoles("admin"), updateCategoryController);

// Delete category (admin only)
categoryRouter.delete("/delete-category/:id", isAuthenticated, authorizeRoles("admin"), deleteCategoryController);

export default categoryRouter;

