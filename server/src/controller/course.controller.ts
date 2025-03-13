import { Request, Response, NextFunction } from "express";

import { updateCourseThumbnail, uploadCourseThumbnail, validateCourseData } from "../services/course.service";
import { ICourse, ICreateCourseRequestBody, IThumbnail } from "../interfaces/course.interface";

import CatchAsyncErrors from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler";
import Course from "../models/course.model";

// Upload Course
export const createCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate request body
        const courseData: Partial<ICreateCourseRequestBody> = req.body;

        // Validate course data
        validateCourseData(req.body, res, next);

        // Upload course thumbnail
        const thumbnailResponse = await uploadCourseThumbnail(courseData.thumbnail as string);

        // Create course
        const course = await Course.create({
            ...courseData,
            thumbnail: {
                public_id: thumbnailResponse.public_id,
                url: thumbnailResponse.secure_url,
            }
        });

        // If course is not created
        if (!course) {
            return next(new ErrorHandler("Course not created", 400));
        }

        // Return success response
        res.status(201).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


// Update Course
export const updateCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get course id from params
        const courseData: Partial<ICourse> = req.body;

        const isExist = await Course.findById(req.params.id);

        if (!isExist) {
            return next(new ErrorHandler("Course not found", 404));
        }

        if (courseData.thumbnail) {
            // @ts-ignore
            const updatedThumbnail = await updateCourseThumbnail(isExist as ICourse, courseData.thumbnail as string);

            courseData.thumbnail = {
                public_id: updatedThumbnail.public_id,
                url: updatedThumbnail.secure_url
            } as IThumbnail;
        }

        // Update course
        const course = await Course.findByIdAndUpdate(req.params.id, { $set: courseData }, { new: true });

        // Return success response
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})