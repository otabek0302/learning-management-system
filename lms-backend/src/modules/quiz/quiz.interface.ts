import type { Document, Schema } from "mongoose";

export interface IQuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  order: number;
}

export interface IQuiz extends Document {
  lesson: Schema.Types.ObjectId;
  title: string;
  questions: IQuizQuestion[];
  passing_score: number;
  time_limit?: number;
  created_at: Date;
  updated_at: Date;
}
