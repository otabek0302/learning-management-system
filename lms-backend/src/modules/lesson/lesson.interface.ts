import type { Document, Schema } from "mongoose";

export interface ILessonResource {
  name: string;
  url: string;
}

export interface ILesson extends Document {
  course: Schema.Types.ObjectId;
  section_order: number;
  title: string;
  slug: string;
  type: "video" | "text" | "quiz" | "assignment";
  content?: string;
  video_url?: string;
  duration: number;
  order: number;
  is_free_preview: boolean;
  resources: ILessonResource[];
  created_at: Date;
  updated_at: Date;
}
