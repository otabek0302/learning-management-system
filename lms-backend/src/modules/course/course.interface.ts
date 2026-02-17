import type { Document, Schema } from "mongoose";

export interface ICourseThumbnail {
  asset_id?: string;
  public_id?: string;
  public_url?: string;
  secure_url?: string;
  resource_type?: string;
  format?: string;
}

export interface ICurriculumSection {
  title: string;
  order: number;
  lessons: Schema.Types.ObjectId[];
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  instructor: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  subcategory?: Schema.Types.ObjectId;
  price: number;
  currency: string;
  thumbnail?: ICourseThumbnail;
  preview_video_url?: string;
  level?: "beginner" | "intermediate" | "advanced" | "all";
  duration: number;
  what_you_will_learn: string[];
  requirements: string[];
  status: "draft" | "published" | "archived";
  curriculum: ICurriculumSection[];
  enrollment_count: number;
  rating: number;
  rating_count: number;
  created_at: Date;
  updated_at: Date;
}
