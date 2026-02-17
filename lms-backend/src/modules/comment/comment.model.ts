import type { IComment } from "./comment.interface";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema<IComment>(
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
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [2000, "Comment must not exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["approved", "pending", "hidden"],
      default: "pending",
    },
    helpful_count: { type: Number, default: 0, min: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

commentSchema.index({ course: 1 });
commentSchema.index({ lesson: 1 });
commentSchema.index({ parent: 1 });
commentSchema.index({ user: 1 });

export const CommentModel = mongoose.model<IComment>("Comment", commentSchema);
