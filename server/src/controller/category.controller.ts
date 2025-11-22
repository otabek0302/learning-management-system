import { Request, Response, NextFunction } from "express";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import ErrorHandler from "../utils/error-handler";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../services/category.service";

// Get all categories
export const getAllCategoriesController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get single category
export const getCategoryByIdController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await getCategoryById(req.params.id);
        res.status(200).json({
            success: true,
            category
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Create category -- Admin
export const createCategoryController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return next(new ErrorHandler("Category name is required", 400));
        }

        const category = await createCategory(name, description);
        res.status(201).json({
            success: true,
            category
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update category -- Admin
export const updateCategoryController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;
        const category = await updateCategory(req.params.id, name, description);
        res.status(200).json({
            success: true,
            category
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete category -- Admin
export const deleteCategoryController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteCategory(req.params.id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

