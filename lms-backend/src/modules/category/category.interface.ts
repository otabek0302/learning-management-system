import type { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: Schema.Types.ObjectId;
  icon?: string;
  image?: string;
  order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
