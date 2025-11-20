import { Request, Response, NextFunction } from "express";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import ErrorHandler from "../utils/error-handler";
import Course from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import { LessonProgress } from "../models/progress.model";

export const completeLesson = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const { courseId, lessonId } = req.body as {
      courseId: string;
      lessonId: string;
    };

    if (!courseId || !lessonId) {
      return next(new ErrorHandler("courseId and lessonId are required", 400));
    }

    const enrollment = await Enrollment.findOne({ userId, courseId, status: "active" });
    if (!enrollment) {
      return next(new ErrorHandler("You are not enrolled in this course", 403));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const lesson = (course.courseData as any).id(lessonId) || course.courseData.find((l: any) => {
      const id = l._id || l.id;
      return id && id.toString() === lessonId;
    });

    if (!lesson) {
      return next(new ErrorHandler("Lesson not found", 404));
    }

    const progress = await LessonProgress.findOneAndUpdate(
      { userId, courseId, lessonId },
      {
        completed: true,
        completedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      progress,
    });
  }
);

export const getCourseProgress = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const { courseId } = req.params;
    if (!courseId) {
      return next(new ErrorHandler("Course ID is required", 400));
    }

    const enrollment = await Enrollment.findOne({ userId, courseId, status: "active" });
    if (!enrollment) {
      return next(new ErrorHandler("You are not enrolled in this course", 403));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const totalLessons = course.courseData.length || 0;
    const completedDocs = await LessonProgress.find({
      userId,
      courseId,
      completed: true,
    });

    const completedLessonIds = completedDocs.map((p) => p.lessonId);
    const completedCount = completedLessonIds.length;
    const percentage = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

    res.status(200).json({
      success: true,
      courseId,
      totalLessons,
      completedCount,
      percentage,
      completedLessonIds,
    });
  }
);

