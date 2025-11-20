import { Response, NextFunction } from "express";
import { ICourse } from "../interfaces/course.interface";

import cloudinary from "cloudinary";
import ErrorHandler from "../utils/error-handler";
import sendMail from "../utils/send-mails";

// Validate Course Data
export const validateCourseData = async (data: ICourse, res: Response, next: NextFunction) => {
    const { name, description, price, estimatedPrice, thumbnail, tags, level, demoUrl, benefits, prerequisites, courseData } = data;

    if (!name || !description || !price || !estimatedPrice || !thumbnail || !tags || !level || !demoUrl || !benefits || !prerequisites || !courseData) {
        console.log("All fields are required");
        next(new ErrorHandler("All fields are required", 400));
        return false;
    }
    return true;
}

// Upload Course Thumbnail
export const uploadCourseThumbnail = async (courseThumbnail: string) => {
    const uploadResponse = await cloudinary.v2.uploader.upload(courseThumbnail, {
        folder: "courses",
        crop: "fill"
    });
    return uploadResponse;
}

// Update Course Thumbnail
export const updateCourseThumbnail = async (course: ICourse, thumbnail: string) => {
    await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);

    const uploadResponse = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
    });

    return uploadResponse;
}

// Send Notification Mail
export const sendNotificationMail = async (data: any, email: string) => {
    try {
        if (email) {
            sendMail({
                email,
                subject: "Reply Comment Notification",
                template: "reply-comment-notification.ejs",
                data
            })
        }
    } catch (error: any) {
        return new ErrorHandler(error.message, 500);
    }
}

// Calculate and update course totals (totalLessons and totalDuration)
export const calculateCourseTotals = async (course: ICourse) => {
    if (!course) return;

    // Calculate total lessons
    course.totalLessons = course.courseData?.length || 0;

    // Calculate total duration (sum of all lesson video lengths)
    course.totalDuration = course.courseData?.reduce(
        (sum, lesson) => sum + (lesson.videoLength || 0),
        0
    ) || 0;

    // Save the course with updated totals
    await course.save();
}