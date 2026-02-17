import type { Document, Schema } from "mongoose";

export interface IProgress extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  completed_lessons: Schema.Types.ObjectId[];
  last_accessed_lesson?: Schema.Types.ObjectId;
  last_accessed_at?: Date;
  total_watch_time: number;
  created_at: Date;
  updated_at: Date;
}
