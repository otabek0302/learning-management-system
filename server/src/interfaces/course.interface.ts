import { Document } from "mongoose";
import { IUser } from "./user.interface";


// Course
export interface ICourse extends Document {
    _id: string;
    name: string;
    description: string;
    category: string; // Reference to Category model
    price: number;
    estimatedPrice?: number;
    thumbnail: IThumbnail;
    tags: string[];
    level: string; // beginner, intermediate, advanced
    benefits: string[];
    prerequisites: string[];
    reviews: IReview[];
    courseData: ICourseData[];
    totalLessons: number;
    totalDuration: number;
    ratings: number;
    purchased: number;
}

// Comments
export interface IComment extends Document {
    user: IUser;
    comment: string;
    commentReplies: IReply[];
}

// Reviews
export interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies: IReply[];
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
    secure_url?: string;        // NEW: Secure URL
}


// Quiz Question
export interface IQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option
}

// Quiz
export interface IQuiz {
    questions: IQuizQuestion[];
    passingScore: number; // %
}

// Video
export interface IVideo extends Document {
    public_id: string;
    url: string;
    secure_url: string;
    duration: number;
    format: string;
}

// Course Data
export interface ICourseData extends Document {
    title: string;
    description?: string;
    video: IVideo;              // Cloudinary video structure
    videoSection: string;
    links: ILink[];
    suggestion?: string;
    comments: IComment[];
    order: number;              // lesson ordering
    isPreview: boolean;         // free preview (can be watched without enrollment)
    isLocked: boolean;          // requires enrollment (locked by default)
    quiz?: IQuiz;               // quiz for this lesson
}

// Request Body
export interface ICreateCourseRequestBody {
    name: string;
    description: string;
    category: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: string;
    tags: string[];
    level: string;
    benefits: string[];
    prerequisites: string[];
    courseData: ICourseData[];
}   

// Add Comment Request Body
export interface IAddCommentRequestBody {
    comment: string;
    courseId: string;
    contentId: string;
}

// Add Reply to Comment Request Body
export interface IAddReplyToCommentRequestBody {
    reply: string;
    courseId: string;
    contentId: string;
    commentId: string;
}

// Reply
export interface IReply extends Document {
    user: IUser;
    reply: string;
}

// Add Review Request Body
export interface IAddReviewRequestBody {
    comment: string;
    rating: number;
}

// Reply to Review Request Body
export interface IReplyToReviewRequestBody {
    comment: string;
    reviewId: string;
    courseId: string;
}

// Delete Course Request Body
export interface IDeleteCourseRequestBody {
    id: string;
}

// Generate Video Url Request Body
export interface IGenerateVideoUrlRequestBody {
    videoId: string;
}