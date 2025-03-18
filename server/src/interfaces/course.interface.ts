import { Document } from "mongoose";
import { IUser } from "./user.interface";


// Course
export interface ICourse extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: IThumbnail;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings: number;
    purchased: number;
}

// Comments
export interface IComment extends Document {
    user: IUser;
    comment: string;
    commentReplies: [];
}

// Reviews
export interface IReview extends Document {
    user: string;
    rating: number;
    comment: string;
}

// Links
export interface ILink extends Document {
    title: string;
    url: string;
}

// Thumbnail
export interface IThumbnail extends Document {
    public_id: string;
    url: string;
}

// Course Data
export interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    comments: IComment[];
}

// Request Body
export interface ICreateCourseRequestBody {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: string;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    courseData: ICourseData[];
    ratings: number;
    purchased: number;
}   

// Add Comment Request Body
export interface IAddCommentRequestBody {
    comment: string;
    courseId: string;
    contentId: string;
}