import type { Request, Response } from "express";
import { AsyncFunction } from "../../middleware/async.middleware";
import { NotFoundError } from "../../shared/errors";
import { courseService } from "./course.service";

export const getAllCourses = AsyncFunction(async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "12");
  const category = (req.query.category as string) || undefined;

  const result = await courseService.findAllPaginated(page, limit, { category });

  res.status(200).json({
    success: true,
    courses: result.courses,
    pagination: {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalCourses: result.totalCourses,
      hasMore: result.hasMore,
    },
  });
});

export const getCourseById = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await courseService.findById(id);
  if (!course) {
    throw new NotFoundError("Course", id);
  }

  res.status(200).json({
    success: true,
    course,
  });
});

export const createCourse = AsyncFunction(async (req: Request, res: Response) => {
  const { name, description, categoryId, price, estimatedPrice, tags, level, thumbnail, benefits, prerequisites, courseData } = req.body;

  const course = await courseService.create({
    name,
    description,
    categoryId,
    price,
    estimatedPrice,
    tags,
    level,
    thumbnail,
    benefits,
    prerequisites,
    courseData,
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
});

export const updateCourse = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, categoryId, price, estimatedPrice, tags, level, thumbnail, benefits, prerequisites, courseData } = req.body;

  const course = await courseService.update(id, {
    name,
    description,
    categoryId,
    price,
    estimatedPrice,
    tags,
    level,
    thumbnail,
    benefits,
    prerequisites,
    courseData,
  });

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    course,
  });
});

export const deleteCourse = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.body;

  await courseService.delete(id);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

