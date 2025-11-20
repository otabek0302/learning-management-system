import { Request, Response, NextFunction } from "express";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import ErrorHandler from "../utils/error-handler";
import Course from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import mongoose from "mongoose";

export const enrollCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const { courseId } = req.body;
    if (!courseId) {
      return next(new ErrorHandler("Course ID is required", 400));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const courseIdStr = courseId.toString();
    const exists = await Enrollment.findOne({ 
      userId, 
      courseId: { $in: [courseId, courseIdStr] } 
    });
    if (exists) {
      return next(new ErrorHandler("Already enrolled in this course", 400));
    }

    const enrollment = await Enrollment.create({
      userId,
      courseId: courseIdStr,
      status: "active",
    });

    res.status(201).json({
      success: true,
      enrollment,
    });
  }
);

export const getMyEnrollments = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const enrollments = await Enrollment.find({ userId }).sort({ createdAt: -1 });
    const courseIds = enrollments
      .map((e) => e.courseId)
      .filter((id) => id && mongoose.Types.ObjectId.isValid(id.toString()));

    const courses = courseIds.length > 0 
      ? await Course.find({ _id: { $in: courseIds } })
      : [];

    const enrollmentsWithCourses = enrollments.map((enrollment) => {
      const course = courses.find(
        (c) => c._id.toString() === enrollment.courseId?.toString()
      );
      const enrollmentObj = enrollment.toObject();
      return {
        ...enrollmentObj,
        courseId: course || enrollmentObj.courseId,
      };
    });

    res.status(200).json({
      success: true,
      enrollments: enrollmentsWithCourses,
    });
  }
);
