import express from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "./category.controller";
import { authenticated, authorized } from "../../middleware/auth.middleware";
import { validateCreateCategory, validateUpdateCategory, validateGetCategoryById, validateDeleteCategory, validateGetAllCategories } from "./category.validation";

const router = express.Router();

router.get("/get-all-categories", validateGetAllCategories, getAllCategories);
router.get("/get-category/:id", validateGetCategoryById, getCategoryById);
router.post("/create-category", authenticated, authorized("admin"), validateCreateCategory, createCategory);
router.put("/update-category/:id", authenticated, authorized("admin"), validateUpdateCategory, updateCategory);
router.delete("/delete-category/:id", authenticated, authorized("admin"), validateDeleteCategory, deleteCategory);

export default router;

