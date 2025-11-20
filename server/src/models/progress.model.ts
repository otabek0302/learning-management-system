import { Schema, model, Document } from "mongoose";

export interface ILessonProgress extends Document {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
}

const lessonProgressSchema = new Schema<ILessonProgress>(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true },
    lessonId: { type: String, required: true },
    completed: { type: Boolean, default: false, index: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ userId: 1, completed: 1 });
lessonProgressSchema.index({ courseId: 1, completed: 1 });
lessonProgressSchema.index({ createdAt: -1 });

export const LessonProgress = model<ILessonProgress>("LessonProgress", lessonProgressSchema);
