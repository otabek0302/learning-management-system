import type { ICourse } from "./course.interface";
import mongoose from "mongoose";
import { curriculumSectionSchema } from "./schemas";

const courseSchema = new mongoose.Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Course title must not exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Course slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    short_description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [500, "Short description must not exceed 500 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD", trim: true },
    thumbnail: {
      asset_id: { type: String },
      public_id: { type: String },
      public_url: { type: String },
      secure_url: { type: String },
      resource_type: { type: String },
      format: { type: String },
    },
    preview_video_url: { type: String, trim: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all"],
      default: "all",
    },
    duration: { type: Number, default: 0, min: 0 },
    what_you_will_learn: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    curriculum: { type: [curriculumSectionSchema], default: [] },
    enrollment_count: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    rating_count: { type: Number, default: 0, min: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

courseSchema.index({ title: "text", short_description: "text", description: "text" });
courseSchema.index({ category: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ status: 1 });

export const CourseModel = mongoose.model<ICourse>("Course", courseSchema);
