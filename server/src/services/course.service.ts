import { Response, NextFunction } from "express";
import { ICourse } from "../interfaces/course.interface";

import ErrorHandler from "../utils/error-handler";
import sendMail from "../utils/send-mails";
import { uploadImage, deleteFile } from "./cloudinary.service";

// Validate Course Data
export const validateCourseData = async (data: any, res: Response, next: NextFunction) => {
    const { name, description, price, estimatedPrice, thumbnail, tags, level, benefits, prerequisites, courseData, category } = data;

    // Required fields validation
    if (!name || !description || !price || !estimatedPrice || !thumbnail || !tags || !level || !benefits || !prerequisites || !courseData || !category) {
        console.log("All required fields are missing");
        next(new ErrorHandler("All required fields are required", 400));
        return false;
    }

    // Validate courseData array
    if (!Array.isArray(courseData) || courseData.length === 0) {
        console.log("Course data must be a non-empty array");
        next(new ErrorHandler("At least one lesson is required", 400));
        return false;
    }

    // Validate each lesson has required fields
    for (let i = 0; i < courseData.length; i++) {
        const lesson = courseData[i];
        if (!lesson.title || !lesson.videoSection) {
            next(new ErrorHandler(`Lesson ${i + 1}: title and videoSection are required`, 400));
            return false;
        }
        // Video validation: video object is required
        if (!lesson.video || !lesson.video.public_id) {
            next(new ErrorHandler(`Lesson ${i + 1}: video is required (must upload video)`, 400));
            return false;
        }
    }

    return true;
}

// Upload Course Thumbnail
export const uploadCourseThumbnail = async (courseThumbnail: string) => {
    const uploadResponse = await uploadImage(courseThumbnail, {
        folder: "courses/thumbnails",
        crop: "fill"
    });
    return uploadResponse;
}

// Update Course Thumbnail
export const updateCourseThumbnail = async (course: ICourse, thumbnail: string) => {
    // Delete old thumbnail if exists
    if (course.thumbnail?.public_id) {
        await deleteFile(course.thumbnail.public_id, "image");
    }

    // Upload new thumbnail
    const uploadResponse = await uploadImage(thumbnail, {
        folder: "courses/thumbnails",
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

    // Calculate total duration (sum of all lesson video durations)
    course.totalDuration = course.courseData?.reduce(
        (sum, lesson) => sum + (lesson.video?.duration || 0),
        0
    ) || 0;

    // Save the course with updated totals
    await course.save();
}