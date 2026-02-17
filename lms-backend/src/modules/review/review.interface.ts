import type { Document, Schema } from "mongoose";

export interface IReview extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  helpful_count: number;
  status: "approved" | "pending" | "hidden";
  created_at: Date;
  updated_at: Date;
}
