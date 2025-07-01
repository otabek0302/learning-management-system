import { Request, Response, NextFunction } from "express";

import { sendNotificationMail, updateCourseThumbnail, uploadCourseThumbnail, validateCourseData } from "../services/course.service";
import { IAddCommentRequestBody, IAddReplyToCommentRequestBody, IAddReviewRequestBody, IComment, ICourse, ICreateCourseRequestBody, IDeleteCourseRequestBody, IGenerateVideoUrlRequestBody, IReply, IReplyToReviewRequestBody, IReview, IThumbnail } from "../interfaces/course.interface";
import { VDOCIPHER_API_SECRET } from "../config/config";
import { createNotification } from "../services/notification.service";

import CatchAsyncErrors from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler";
import Course from "../models/course.model";
import redis from "../utils/redis";
import axios from "axios";

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

        // Create Notification
        await createNotification({
            user: req.user?._id || "",
            title: "New Course",
            message: `You have a new course ${course.name}`
        });

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

        // Create Notification
        await createNotification({
            user: req.user?._id || "",
            title: "Course Updated",
            message: `You have updated your course ${course?.name}`
        });

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

            // page, limit, skip
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            // Get all courses
            const courses = await Course.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links").skip(skip).limit(limit);

            // Get total count for pagination
            const totalCourses = await Course.countDocuments();

            // Cache courses
            await redis.set("courses", JSON.stringify(courses));

            // Return success response
            res.status(200).json({
                success: true,
                courses,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses,
                    hasMore: totalCourses > skip + courses.length
                }
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
        const course = await Course.findById(courseId)

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
        const course = await Course.findById(courseId);

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
            commentReplies: [] as IReply[]
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

// Add Reply to Comment in Course
export const addReplyToComment = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get course id, content id and comment id from body
        const { reply, courseId, contentId, commentId }: IAddReplyToCommentRequestBody = req.body;

        // Check if course exists
        const course = await Course.findById(courseId);

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

        // Check if comment exists
        const comment = content?.comments.find((item: any) => item._id.equals(commentId));

        // Check if comment exists
        if (!comment) {
            return next(new ErrorHandler("Comment not found", 400));
        }

        // Create a new reply object
        const newReply = {
            user: req.user,
            reply: reply
        } as IReply;

        // Add reply to comment
        comment.commentReplies.push(newReply);

        // Save course
        await course.save();

        // If user is not the commenter, send notification
        if (req.user?._id !== comment.user?._id) {
            // Send notification
            await createNotification({
                user: comment.user?._id?.toString() || "",
                title: "New Reply",
                message: `${req.user?.name} replied to your comment`
            });
        } else {
            // Return success response
            const data = {
                name: comment.user?.name,
                title: content?.title,
                url: `${process.env.FRONTEND_URL}/course/${courseId}/content/${contentId}?commentId=${commentId}`
            }

            // Send reply notification
            await sendNotificationMail(data, comment.user?.email);
        }

        // Return success response
        res.status(200).json({
            success: true,
            message: "Reply added successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Add Review in Course
export const addReview = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get review, rating and user id from body
        const { comment, rating }: IAddReviewRequestBody = req.body;

        // Get user course list
        const userCourseList = req.user?.courses;

        // Get course id from params
        const courseId = req.params.id;

        // Check if user has purchased the course
        const courseExists = userCourseList?.some((course: any) => course._id.toString() === courseId);

        // If course does not exist
        if (!courseExists) {
            return next(new ErrorHandler("You have not purchased this course", 400));
        }

        // Check if course exists
        const course = await Course.findById(courseId);

        // Check if course exists
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }

        // Create a new review object
        const reviewData = {
            user: req.user,
            comment,
            rating: rating
        } as IReview;

        // Add review to course
        course.reviews.push(reviewData);

        // Calculate total rating
        const totalRating = course.reviews.reduce((acc: number, curr: IReview) => acc + curr.rating, 0);

        // Calculate average rating
        const averageRating = totalRating / (course.reviews?.length || 0);

        // Update course rating
        course.ratings = parseFloat(averageRating.toFixed(1));

        // Save course
        await course.save();

        // Send review notification
        await createNotification({
            user: req.user?._id || "",
            title: "New Review",
            message: `${req.user?.name} reviewed your course`
        })

        // Return success response
        res.status(200).json({
            success: true,
            message: "Review added successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Reply to Review in Course
export const replyToReview = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get reply, review id and course id from body
        const { comment, reviewId, courseId }: IReplyToReviewRequestBody = req.body;

        // Check if course exists
        const course = await Course.findById(courseId);

        // Check if course exists
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }

        // Check if review exists
        const review = course.reviews.find((item: any) => item._id.equals(reviewId));

        // Check if review exists
        if (!review) {
            return next(new ErrorHandler("Review not found", 400));
        }

        // Create a new reply object
        const replyData = {
            user: req.user,
            comment: comment
        } as any;

        // Add reply to review
        review.commentReplies.push(replyData);

        // Save course
        await course.save();

        // Send reply notification
        if (req.user?._id !== review.user?._id) {
            // Send notification
            await createNotification({
                user: review.user?._id?.toString() || "",
                title: "New Reply",
                message: `${req.user?.name} replied to your review`
            })
        } else {
            // Return success response
            const data = {
                name: review.user?.name,
                title: course?.name,
                url: `${process.env.FRONTEND_URL}/course/${courseId}?reviewId=${reviewId}`
            }

            // Send reply notification
            await sendNotificationMail(data, review.user?.email);
        }
        // Return success response
        res.status(200).json({
            success: true,
            message: "Reply added successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Admin Routes
// Get All Courses

export const getAllCoursesAdmin = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        // Create base query excluding the requesting user and password
        const baseQuery = Course.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        // Get total count for pagination
        const totalCourses = await Course.countDocuments();

        // Execute paginated query
        const courses = await baseQuery.skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            courses,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses,
                hasMore: totalCourses > skip + courses.length
            }
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

export const deleteCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get course id from body
        const { id } = req.body as IDeleteCourseRequestBody;

        // Check if course exists
        const course = await Course.findById(id);

        // Check if course exists
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }

        // Delete course
        await course.deleteOne();

        // Delete course from redis
        await redis.del(id);

        // Return success response
        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Generate Video Url
export const generateVideoUrlController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body as IGenerateVideoUrlRequestBody;
        console.log("videoId", videoId);
        console.log(VDOCIPHER_API_SECRET);
        

        const response = await axios.get(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, {
            params: {
                ttl: 3600
            },
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${VDOCIPHER_API_SECRET}`
            }
        });

        console.log(response.data);


        // Return the raw VdoCipher response (otp, playbackInfo)
        res.status(200).json(response.data);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})