import { Request, Response, NextFunction } from "express";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import ErrorHandler from "../utils/error-handler";
import Course from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import { QuizResult } from "../models/quiz-result.model";

export const submitQuiz = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  const { courseId, lessonId, answers } = req.body;
  if (!courseId || !lessonId || !answers) {
    return next(new ErrorHandler("courseId, lessonId, and answers are required", 400));
  }

  const enrollment = await Enrollment.findOne({ userId, courseId });
  if (!enrollment) {
    return next(new ErrorHandler("You are not enrolled in this course", 403));
  }

  const course = await Course.findById(courseId);
  if (!course) return next(new ErrorHandler("Course not found", 404));

  const lesson = (course.courseData as any).id(lessonId) || course.courseData.find((l: any) => {
    const id = l._id || l.id;
    return id && id.toString() === lessonId;
  });

  if (!lesson) {
    return next(new ErrorHandler("Lesson not found", 404));
  }

  const lessonQuiz = (lesson as any).quiz;
  if (!lessonQuiz || !lessonQuiz.questions || !Array.isArray(lessonQuiz.questions)) {
    return next(new ErrorHandler("Quiz not found for this lesson", 404));
  }

  const questions = lessonQuiz.questions;
  const passingScore = lessonQuiz.passingScore || 70;

  if (questions.length !== answers.length) {
    return next(new ErrorHandler("Incomplete quiz submission", 400));
  }

  let correct = 0;
  questions.forEach((q: any, idx: number) => {
    if (answers[idx] === q.correctAnswer) correct++;
  });

  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= passingScore;

  const result = await QuizResult.findOneAndUpdate(
    { userId, courseId, lessonId },
    {
      score,
      passed,
      answers,
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    score,
    passed,
    result,
  });
});

