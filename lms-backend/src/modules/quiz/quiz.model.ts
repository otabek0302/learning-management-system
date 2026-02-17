import type { IQuiz } from "./quiz.interface";
import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: [{ type: String, required: true, trim: true }],
    correct_answer: { type: Number, required: true, min: 0 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema<IQuiz>(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson is required"],
    },
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [200, "Quiz title must not exceed 200 characters"],
    },
    questions: { type: [quizQuestionSchema], default: [] },
    passing_score: { type: Number, default: 70, min: 0, max: 100 },
    time_limit: { type: Number, min: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

quizSchema.index({ lesson: 1 }, { unique: true });

export const QuizModel = mongoose.model<IQuiz>("Quiz", quizSchema);
