import { Schema, model, Document } from "mongoose";

export interface IQuizResult extends Document {
  userId: string;
  courseId: string;
  lessonId: string;
  score: number;
  passed: boolean;
  answers: number[];
}

const quizResultSchema = new Schema<IQuizResult>(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true },
    lessonId: { type: String, required: true },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true, index: true },
    answers: [{ type: Number, required: true }],
  },
  { timestamps: true }
);

quizResultSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });
quizResultSchema.index({ userId: 1, passed: 1 });
quizResultSchema.index({ courseId: 1, passed: 1 });
quizResultSchema.index({ createdAt: -1 });

export const QuizResult = model<IQuizResult>("QuizResult", quizResultSchema);
