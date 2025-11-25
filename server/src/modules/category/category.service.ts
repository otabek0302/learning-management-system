import type { ICategory, ICreateCategory, IUpdateCategory } from "./category.interface";
import CategoryModel from "./category.model";
import { ValidationError } from "../../shared/errors/validation.error";
import { ConflictError } from "../../shared/errors/conflict.error";
import { NotFoundError } from "../../shared/errors/not-found.error";

export class CategoryService {
  private static instance: CategoryService;

  private constructor() {}

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  async findById(id: string): Promise<ICategory | null> {
    if (!id) {
      throw new ValidationError("Category ID is required");
    }
    return await CategoryModel.findById(id);
  }

  async findByName(name: string): Promise<ICategory | null> {
    if (!name?.trim()) {
      throw new ValidationError("Category name is required");
    }
    return await CategoryModel.findOne({ name: name.trim() });
  }

  async findAll(): Promise<ICategory[]> {
    return await CategoryModel.find().sort({ createdAt: -1 });
  }

  async findAllPaginated(page: number = 1, limit: number = 12): Promise<{
    categories: ICategory[];
    totalCategories: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;
    const totalCategories = await CategoryModel.countDocuments();
    const categories = await CategoryModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    return {
      categories: categories as ICategory[],
      totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
      currentPage: page,
      hasMore: totalCategories > skip + categories.length,
    };
  }

  async create(data: ICreateCategory): Promise<ICategory> {
    if (!data.name?.trim()) {
      throw new ValidationError("Category name is required");
    }

    const existingCategory = await this.findByName(data.name);
    if (existingCategory) {
      throw new ConflictError("Category with this name already exists", { name: data.name });
    }

    return await CategoryModel.create({
      name: data.name.trim(),
      description: data.description?.trim(),
    });
  }

  async update(id: string, data: IUpdateCategory): Promise<ICategory> {
    if (!id) {
      throw new ValidationError("Category ID is required");
    }

    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundError("Category", id);
    }

    if (data.name?.trim() && data.name.trim() !== category.name) {
      const existingCategory = await this.findByName(data.name.trim());
      if (existingCategory && String(existingCategory._id) !== id) {
        throw new ConflictError("Category with this name already exists", { name: data.name });
      }
    }

    if (data.name) category.name = data.name.trim();
    if (data.description !== undefined) category.description = data.description?.trim() || undefined;

    await category.save();
    return category;
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError("Category ID is required");
    }

    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundError("Category", id);
    }

    await category.deleteOne();
  }
}

export const categoryService = CategoryService.getInstance();

