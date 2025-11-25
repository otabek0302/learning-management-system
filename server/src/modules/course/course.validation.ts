import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../../shared/errors/validation.error";

const linkSchema = z.object({
  title: z.string().max(200, "Link title must not exceed 200 characters").trim().optional(),
  url: z.string().trim().optional(),
});

const quizQuestionSchema = z.object({
  question: z.string().min(1, "Quiz question is required").trim(),
  options: z.array(z.string().min(1, "Quiz option cannot be empty")).min(2, "Each question must have at least two options"),
  correctAnswer: z.number().int().nonnegative(),
});

const quizSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1, "Quiz must contain at least one question"),
  passingScore: z.number().int().min(0).max(100).optional(),
});

const videoSchema = z.object({
  public_id: z.string().min(1, "Video public_id is required"),
  url: z.string().min(1, "Video URL is required"),
  secure_url: z.string().min(1, "Video secure_url is required"),
  duration: z.number().nonnegative().optional(),
  format: z.string().optional(),
});

const courseContentSchema = z
  .object({
    title: z.string().min(1, "Lesson title is required").max(200, "Lesson title must not exceed 200 characters").trim(),
    description: z.string().trim().optional(),
    videoSection: z.string().max(200, "Video section must not exceed 200 characters").trim().optional(),
    links: z.array(linkSchema).optional(),
    suggestion: z.string().trim().optional(),
    order: z.number().int().nonnegative().optional(),
    isPreview: z.boolean().optional(),
    isLocked: z.boolean().optional(),
    video: videoSchema.optional(),
    videoUrl: z.string().min(1, "Lesson video is required").optional(),
    quiz: quizSchema.optional(),
  })
  .refine((data) => !!data.video || !!data.videoUrl, {
    message: "Each lesson must include either an uploaded video or a videoUrl",
    path: ["video"],
  });

const tagsSchema = z.union([
  z.string().min(1, "Tags cannot be empty"),
  z.array(z.string().min(1, "Tag cannot be empty")).min(1, "At least one tag is required"),
]);

export const createCourseSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Course name must be at least 3 characters").max(200, "Course name must not exceed 200 characters").trim(),
    description: z.string().min(20, "Description must be at least 20 characters").trim(),
    categoryId: z.string().min(1, "Category ID is required").trim(),
    price: z.number().nonnegative("Price must be a positive number"),
    estimatedPrice: z.number().nonnegative("Estimated price must be a positive number"),
    tags: tagsSchema,
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    thumbnail: z
      .string()
      .min(1, "Thumbnail data is required")
      .refine((value) => value.startsWith("data:") || value.startsWith("http"), "Thumbnail must be a base64 data URL or an existing URL"),
    benefits: z.array(z.string().min(1)).optional(),
    prerequisites: z.array(z.string().min(1)).optional(),
    courseData: z.array(courseContentSchema).min(1, "At least one lesson is required"),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Course ID is required"),
  }),
  body: z
    .object({
      name: z.string().min(3).max(200).trim().optional(),
      description: z.string().min(20).trim().optional(),
      categoryId: z.string().min(1, "Category ID is required").trim().optional(),
      price: z.number().nonnegative().optional(),
      estimatedPrice: z.number().nonnegative().optional(),
      tags: tagsSchema.optional(),
      level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
      thumbnail: z
        .string()
        .min(1)
        .refine((value) => value.startsWith("data:") || value.startsWith("http"), "Thumbnail must be a base64 data URL or an existing URL")
        .optional(),
      benefits: z.array(z.string().min(1)).optional(),
      prerequisites: z.array(z.string().min(1)).optional(),
      courseData: z.array(courseContentSchema).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const getCourseByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Course ID is required"),
  }),
});

export const deleteCourseSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Course ID is required"),
  }),
});

export const getCoursesQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .refine((value) => (value ? !Number.isNaN(Number(value)) && Number(value) > 0 : true), "Page must be a positive number"),
    limit: z
      .string()
      .optional()
      .refine((value) => (value ? !Number.isNaN(Number(value)) && Number(value) > 0 : true), "Limit must be a positive number"),
    category: z.string().optional(),
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

export const validateCreateCourse = validate(createCourseSchema);
export const validateUpdateCourse = validate(updateCourseSchema);
export const validateGetCourseById = validate(getCourseByIdSchema);
export const validateDeleteCourse = validate(deleteCourseSchema);
export const validateGetCoursesQuery = validate(getCoursesQuerySchema);
