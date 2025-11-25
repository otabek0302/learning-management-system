import type { Request, Response } from "express";
import { AsyncFunction } from "../../middleware/async.middleware";
import { NotFoundError } from "../../shared/errors";
import { categoryService } from "./category.service";

export const getAllCategories = AsyncFunction(async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "12");

  const result = await categoryService.findAllPaginated(page, limit);

  res.status(200).json({
    success: true,
    categories: result.categories,
    pagination: {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalCategories: result.totalCategories,
      hasMore: result.hasMore,
    },
  });
});

export const getCategoryById = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await categoryService.findById(id);
  if (!category) {
    throw new NotFoundError("Category", id);
  }

  res.status(200).json({
    success: true,
    category,
  });
});

export const createCategory = AsyncFunction(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const category = await categoryService.create({ name, description });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

export const updateCategory = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await categoryService.update(id, { name, description });

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

export const deleteCategory = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  await categoryService.delete(id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

