import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import ErrorHandler from "../utils/error-handler";
import Course from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import { LessonProgress } from "../models/progress.model";
import { QuizResult } from "../models/quiz-result.model";
import { Certificate } from "../models/certificate.model";
import { generateCertificatePdf } from "../services/certificate.service";

const generateCertificateId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "CERT-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const issueCertificate = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const { courseId } = req.body;
    if (!courseId) {
      return next(new ErrorHandler("Course ID is required", 400));
    }

    const courseObjectId = mongoose.Types.ObjectId.isValid(courseId)
      ? new mongoose.Types.ObjectId(courseId)
      : courseId;

    const enrollment = await Enrollment.findOne({ 
      userId, 
      courseId: { $in: [courseId, courseObjectId] } 
    });
    if (!enrollment) {
      return next(new ErrorHandler("You are not enrolled in this course", 403));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const lessons = course.courseData;
    const lessonIds = lessons.map((l) => {
      const id = (l as any)._id || (l as any).id;
      return id ? id.toString() : "";
    }).filter((id) => id);

    const completed = await LessonProgress.find({
      userId,
      courseId: { $in: [courseId, courseId.toString()] },
      lessonId: { $in: lessonIds },
      completed: true,
    });

    if (completed.length !== lessonIds.length) {
      return next(
        new ErrorHandler(
          `You must complete all lessons (${completed.length}/${lessonIds.length})`,
          400
        )
      );
    }

    const lessonsWithQuiz = lessons.filter((l) => {
      const quiz = (l as any).quiz;
      return quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0;
    });

    for (const lesson of lessonsWithQuiz) {
      const lessonId = (lesson as any)._id || (lesson as any).id;
      if (!lessonId) continue;

      const quiz = await QuizResult.findOne({
        userId,
        courseId: { $in: [courseId, courseId.toString()] },
        lessonId: lessonId.toString(),
        passed: true,
      });

      if (!quiz) {
        return next(
          new ErrorHandler(
            `You must pass the quiz for lesson "${lesson.title}"`,
            400
          )
        );
      }
    }

    let certificate = await Certificate.findOne({ userId, courseId: courseObjectId });
    if (certificate && certificate.pdfUrl) {
      return res.status(200).json({
        success: true,
        message: "Certificate already issued",
        certificate,
      });
    }

    if (!certificate) {
      const certificateId = generateCertificateId();
      certificate = await Certificate.create({
        userId,
        courseId: courseObjectId,
        certificateId,
        issuedAt: new Date(),
      });
    }

    const pdfUrl = await generateCertificatePdf({ certificate });
    certificate.pdfUrl = pdfUrl;
    await certificate.save();

    res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      certificate,
    });
  }
);

export const getMyCertificate = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { courseId } = req.params;
    const courseObjectId = mongoose.Types.ObjectId.isValid(courseId)
      ? new mongoose.Types.ObjectId(courseId)
      : courseId;

    const cert = await Certificate.findOne({ userId, courseId: courseObjectId }).populate("courseId");
    if (!cert) {
      return next(new ErrorHandler("Certificate not found", 404));
    }

    res.status(200).json({ success: true, certificate: cert });
  }
);

export const getMyCertificates = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const certificates = await Certificate.find({ userId })
      .populate("courseId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  }
);
