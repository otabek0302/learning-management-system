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

const videoSchema = new Schema({
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    secure_url: { type: String, required: true },
    duration: { type: Number, required: true },
    format: { type: String, default: "mp4" },
}, { _id: false });

const courseDataSchema = new Schema<ICourseData>({
    title: { type: String, required: true },
    description: { type: String },
    video: {
        type: videoSchema,
        required: true,
    },
    videoSection: { type: String, required: true },
    links: [linkSchema],
    suggestion: String,
    comments: [commentSchema],
    order: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false }, // Free preview lesson
    isLocked: { type: Boolean, default: true },    // Requires enrollment
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
    category: { type: String, required: true, ref: "Category" },
    price: { type: Number, required: true },
    estimatedPrice: Number,
    thumbnail: {
        public_id: { type: String },
        url: { type: String },
        secure_url: { type: String },
    },
    tags: [{ type: String }],
    benefits: [{ type: String }],
    prerequisites: [{ type: String }],
    level: { type: String, required: true },
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    totalLessons: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
}, { timestamps: true });

const CourseModel: Model<ICourse> = model("Course", courseSchema);

export default CourseModel;
