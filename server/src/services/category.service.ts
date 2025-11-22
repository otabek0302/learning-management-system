import Category from "../models/category.model";
import ErrorHandler from "../utils/error-handler";

// Get all categories
export const getAllCategories = async () => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        return categories;
    } catch (error: any) {
        throw new ErrorHandler(error.message, 500);
    }
};

// Get single category by ID
export const getCategoryById = async (id: string) => {
    try {
        const category = await Category.findById(id);
        if (!category) {
            throw new ErrorHandler("Category not found", 404);
        }
        return category;
    } catch (error: any) {
        throw new ErrorHandler(error.message, 500);
    }
};

// Create category
export const createCategory = async (name: string, description?: string) => {
    try {
        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            throw new ErrorHandler("Category with this name already exists", 409);
        }

        const category = await Category.create({
            name: name.trim(),
            description: description?.trim(),
        });

        return category;
    } catch (error: any) {
        throw new ErrorHandler(error.message, 500);
    }
};

// Update category
export const updateCategory = async (id: string, name?: string, description?: string) => {
    try {
        const category = await Category.findById(id);
        if (!category) {
            throw new ErrorHandler("Category not found", 404);
        }

        // Check if new name conflicts with existing category
        if (name && name.trim() !== category.name) {
            const existingCategory = await Category.findOne({ name: name.trim() });
            if (existingCategory) {
                throw new ErrorHandler("Category with this name already exists", 409);
            }
        }

        if (name) category.name = name.trim();
        if (description !== undefined) category.description = description?.trim();

        await category.save();
        return category;
    } catch (error: any) {
        throw new ErrorHandler(error.message, 500);
    }
};

// Delete category
export const deleteCategory = async (id: string) => {
    try {
        const category = await Category.findById(id);
        if (!category) {
            throw new ErrorHandler("Category not found", 404);
        }

        await category.deleteOne();
        return { success: true };
    } catch (error: any) {
        throw new ErrorHandler(error.message, 500);
    }
};

