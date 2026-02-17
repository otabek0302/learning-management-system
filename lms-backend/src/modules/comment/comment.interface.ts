import type { Document, Schema } from "mongoose";

export interface IComment extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  lesson?: Schema.Types.ObjectId;
  parent?: Schema.Types.ObjectId;
  content: string;
  status: "approved" | "pending" | "hidden";
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
}
