import type { ILesson } from "./lesson.interface";
import mongoose from "mongoose";

const lessonResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const lessonSchema = new mongoose.Schema<ILesson>(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    section_order: { type: Number, default: 0 },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      maxlength: [200, "Lesson title must not exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Lesson slug is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["video", "text", "quiz", "assignment"],
      default: "video",
    },
    content: { type: String, trim: true },
    video_url: { type: String, trim: true },
    duration: { type: Number, default: 0, min: 0 },
    order: { type: Number, default: 0 },
    is_free_preview: { type: Boolean, default: false },
    resources: { type: [lessonResourceSchema], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

lessonSchema.index({ course: 1, section_order: 1, order: 1 });
lessonSchema.index({ course: 1, slug: 1 }, { unique: true });

export const LessonModel = mongoose.model<ILesson>("Lesson", lessonSchema);
