import { Model, Schema, model } from "mongoose";
import { IComment, IReview, ILink, ICourseData, ICourse } from "../interfaces/course.interface";

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object],
}, { timestamps: true });

const linkSchema = new Schema<ILink>({
    title: String,
    url: String,
});

const commentSchema = new Schema<IComment>({
    user: Object,
    comment: String,
    commentReplies: [Object],
}, { timestamps: true });

const courseDataSchema = new Schema<ICourseData>({
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true },
    videoSection: { type: String, required: true },
    videoLength: { type: Number },
    videoPlayer: { type: String },
    links: [linkSchema],
    suggestion: String,
    comments: [commentSchema],
    order: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: true },
    quiz: {
        questions: [
            {
                question: { type: String, required: true },
                options: [{ type: String, required: true }],
                correctAnswer: { type: Number, required: true },
            },
        ],
        passingScore: { type: Number, default: 70 },
    },
});

const courseSchema = new Schema<ICourse>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedPrice: Number,
    thumbnail: {
        public_id: { type: String },
        url: { type: String },
    },
    tags: [{ type: String }],
    benefits: [{ type: String }],
    prerequisites: [{ type: String }],
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    totalLessons: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
}, { timestamps: true });

const CourseModel: Model<ICourse> = model("Course", courseSchema);

export default CourseModel;
