import type { IProgress } from "./progress.interface";
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema<IProgress>(
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
    completed_lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    last_accessed_lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    last_accessed_at: { type: Date },
    total_watch_time: { type: Number, default: 0, min: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });
progressSchema.index({ user: 1 });

export const ProgressModel = mongoose.model<IProgress>("Progress", progressSchema);
