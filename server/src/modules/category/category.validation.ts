import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../../shared/errors/validation.error";

const nameSchema = z.string().min(2, "Category name must be at least 2 characters").max(50, "Category name must not exceed 50 characters").trim();
const descriptionSchema = z.string().max(500, "Description must not exceed 500 characters").trim().optional();

export const createCategorySchema = z.object({
  body: z.object({
    name: nameSchema,
    description: descriptionSchema,
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
  body: z
    .object({
      name: nameSchema.optional(),
      description: descriptionSchema,
    })
    .refine((data) => data.name !== undefined || data.description !== undefined, {
      message: "At least one field (name or description) must be provided for update",
    }),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
});

export const getAllCategoriesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

type ValidationSchema = z.ZodSchema<any>;

const validate = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fields: Record<string, string[]> = {};
        error.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path.join(".");
          if (!fields[path]) {
            fields[path] = [];
          }
          fields[path].push(issue.message);
        });
        return next(new ValidationError("Validation failed", fields));
      }
      next(error);
    }
  };
};

export const validateCreateCategory = validate(createCategorySchema);
export const validateUpdateCategory = validate(updateCategorySchema);
export const validateGetCategoryById = validate(getCategoryByIdSchema);
export const validateDeleteCategory = validate(deleteCategorySchema);
export const validateGetAllCategories = validate(getAllCategoriesSchema);

