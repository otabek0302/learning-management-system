import { Response, NextFunction } from "express";
import { ICourse, IThumbnail } from "../interfaces/course.interface";

import cloudinary from "cloudinary";
import ErrorHandler from "../utils/ErrorHandler";

// Validate Course Data
export const validateCourseData = async (data: ICourse, res: Response, next: NextFunction) => {
    const { name, description, price, estimatedPrice, thumbnail, tags, level, demoUrl, benefits, prerequisites, reviews, courseData, ratings, purchased } = data;

    if (!name || !description || !price || !estimatedPrice || !thumbnail || !tags || !level || !demoUrl || !benefits || !prerequisites || !reviews || !courseData || !ratings || !purchased) {
        return next(new ErrorHandler("All fields are required", 400));
    }
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
    console.log(uploadResponse);
    

    return uploadResponse;
}