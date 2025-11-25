import type { ICourse, ICourseData, IComment, ILink, IReview, IVideo } from "./course.interface";
import { Model, Schema } from "mongoose";
import mongoose from "mongoose";

/* ---------------------- Review Schema ---------------------- */
const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    comment: { type: String, trim: true, maxlength: 1000 },
    commentReplies: [{ type: Object }],
  },
  { timestamps: true }
);

/* ---------------------- Comment Schema ---------------------- */
const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    commentReplies: [{ type: Object }],
  },
  { timestamps: true }
);

/* ---------------------- Link Schema ---------------------- */
const linkSchema = new Schema<ILink>(
  {
    title: { type: String, trim: true, maxlength: 200 },
    url: { type: String, trim: true },
  },
  { _id: false }
);

/* ---------------------- Video Schema ---------------------- */
const videoSchema = new Schema<IVideo>(
  {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    secure_url: { type: String, required: true },
    duration: { type: Number, default: 0, min: 0 },
    format: { type: String, default: "mp4", trim: true },
  },
  { _id: false }
);

/* ---------------------- Course Data Schema ---------------------- */
const courseDataSchema = new Schema<ICourseData>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true },

  // cloudinary video object
  video: { type: videoSchema, required: true },

  videoSection: { type: String, required: true, trim: true, maxlength: 200, default: "Untitled Section" },

  links: { type: [linkSchema], default: [] },
  suggestion: { type: String, trim: true },

  comments: { type: [commentSchema], default: [] },

  order: { type: Number, default: 0, min: 0 },

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

/* ---------------------- Course Schema ---------------------- */
const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      minlength: [3, "Course name must be at least 3 characters"],
      maxlength: [200, "Course name must not exceed 200 characters"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      minlength: [20, "Course description must be at least 20 characters"],
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Course category is required"],
    },

    price: { type: Number, required: [true, "Course price is required"], min: [0, "Price must be positive"] },
    estimatedPrice: { type: Number, required: [true, "Estimated price is required"], min: [0, "Estimated price must be positive"] },

    thumbnail: {
      public_id: { type: String, trim: true },
      url: { type: String, trim: true },
      secure_url: { type: String, trim: true },
    },

    tags: { type: [String], default: [], set: (tags: string[]) => tags?.map((tag) => tag?.trim()).filter(Boolean) },
    benefits: { type: [String], default: [], set: (items: string[]) => items?.map((item) => item?.trim()).filter(Boolean) },
    prerequisites: { type: [String], default: [], set: (items: string[]) => items?.map((item) => item?.trim()).filter(Boolean) },

    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // course-level reviews
    reviews: { type: [reviewSchema], default: [] },

    // lessons
    courseData: { type: [courseDataSchema], default: [] },

    totalLessons: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },

    ratings: { type: Number, default: 0, min: 0 },
    purchased: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

/* ---------------------- Indexes ---------------------- */
courseSchema.index({ name: "text", description: "text", tags: "text" });
courseSchema.index({ categoryId: 1 });

courseSchema.pre<ICourse>("save", function (next) {
  if (Array.isArray(this.courseData) && this.courseData.length > 0) {
    this.totalLessons = this.courseData.length;
    this.totalDuration = this.courseData.reduce((sum, lesson) => sum + (lesson.video?.duration || 0), 0);
  } else {
    this.totalLessons = 0;
    this.totalDuration = 0;
  }
  next();
});

const CourseModel: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);

export default CourseModel;
