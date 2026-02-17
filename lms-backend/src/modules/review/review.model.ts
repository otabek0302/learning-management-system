import type { IReview } from "./review.interface";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema<IReview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: { type: String, trim: true, maxlength: [2000, "Comment must not exceed 2000 characters"] },
    helpful_count: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["approved", "pending", "hidden"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

reviewSchema.index({ user: 1, course: 1 }, { unique: true });
reviewSchema.index({ course: 1 });
reviewSchema.index({ course: 1, status: 1 });

export const ReviewModel = mongoose.model<IReview>("Review", reviewSchema);
