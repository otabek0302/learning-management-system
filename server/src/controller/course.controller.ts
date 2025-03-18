import { Request, Response, NextFunction } from "express";

import { updateCourseThumbnail, uploadCourseThumbnail, validateCourseData } from "../services/course.service";
import { IAddCommentRequestBody, IComment, ICourse, ICreateCourseRequestBody, IThumbnail } from "../interfaces/course.interface";

import CatchAsyncErrors from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler";
import Course from "../models/course.model";
import redis from "../utils/redis";
import CourseModel from "../models/course.model";

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

// Get Single Course - With Purchased Course
export const getSingleCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if course is cached
        const isCached = await redis.get(req.params.id);

        if (isCached) {
            const cachedCourse = isCached as unknown as ICourse;

            return res.status(200).json({
                success: true,
                course: cachedCourse
            })

        } else {

            // Get course id from params
            const course = await Course.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            // Cache course
            await redis.set(req.params.id, JSON.stringify(course));

            // Return success response
            res.status(200).json({
                success: true,
                course
            })

        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Get All Courses with Purchased Course
export const getAllCourses = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Check if courses are cached
        const isCached = await redis.get("courses");

        if (isCached) {
            const cachedCourses = isCached as unknown as ICourse[];

            return res.status(200).json({
                success: true,
                courses: cachedCourses
            })
        } else {

            // Get all courses
            const courses = await Course.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

            // Cache courses
            await redis.set("courses", JSON.stringify(courses));

            // Return success response
            res.status(200).json({
                success: true,
                courses
            })
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Get course content - only for subscribed users
export const getCourseByUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get courses of user
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        // Check if user has purchased the course
        const courseExists = userCourseList?.find((course: any) => course._id.toString() === courseId);

        // If course does not exist
        if (!courseExists) {
            return next(new ErrorHandler("You have not purchased this course", 400));
        }

        // Get course details
        const course = await CourseModel.findById(courseId)

        // Get course content
        const content = course?.courseData;
        
        res.status(200).json({
            success: true,
            content
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Add Comment in Course 
export const addComment = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get course id, content id and question from body
        const { comment, courseId, contentId }: IAddCommentRequestBody = req.body;

        // Check if course exists
        const course = await CourseModel.findById(courseId);

        // Check if course exists
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }

        // Check if content exists
        const content = course?.courseData.find((item: any) => item._id.equals(contentId));

        // Check if content exists
        if (!content) {
            return next(new ErrorHandler("Content not found", 400));
        }

        // Check if comment already exists
        const commentExists = content?.comments.find((item: any) => item.comment === comment);

        // If comment already exists
        if (commentExists) {
            return next(new ErrorHandler("Comment already exists", 400));
        }
        // Create a new comment object
        const newComment = {
            user: req.user,
            comment: comment,
            commentReplies: []
        } as IComment;

        // Add question to content
        content?.comments.push(newComment);

        // Save course
        await course.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: "Comment added successfully"
        })
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})