import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../../shared/errors/validation.error";

const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Question must not exceed 500 characters").trim(),
  answer: z.string().min(1, "Answer is required").max(2000, "Answer must not exceed 2000 characters").trim(),
});

export const createLayoutSchema = z.object({
  body: z.object({
    type: z.enum(["banner", "faq", "categories"]),
    title: z.string().max(200, "Title must not exceed 200 characters").trim().optional(),
    subTitle: z.string().max(500, "Subtitle must not exceed 500 characters").trim().optional(),
    image: z.string().optional(),
    faq: z.array(faqItemSchema).optional(),
    categories: z.array(z.string().min(1, "Category ID is required")).optional(),
  }),
});

export const updateLayoutSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Layout ID is required"),
  }),
  body: z.object({
    title: z.string().max(200, "Title must not exceed 200 characters").trim().optional(),
    subTitle: z.string().max(500, "Subtitle must not exceed 500 characters").trim().optional(),
    image: z.string().optional(),
    faq: z.array(faqItemSchema).optional(),
    categories: z.array(z.string().min(1, "Category ID is required")).optional(),
  }),
});

export const getLayoutByTypeSchema = z.object({
  params: z.object({
    type: z.enum(["banner", "faq", "categories"]),
  }),
});

export const getLayoutByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Layout ID is required"),
  }),
});

export const deleteLayoutSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Layout ID is required"),
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

export const validateCreateLayout = validate(createLayoutSchema);
export const validateUpdateLayout = validate(updateLayoutSchema);
export const validateGetLayoutByType = validate(getLayoutByTypeSchema);
export const validateGetLayoutById = validate(getLayoutByIdSchema);
export const validateDeleteLayout = validate(deleteLayoutSchema);

