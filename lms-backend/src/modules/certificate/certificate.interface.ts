import type { Document, Schema } from "mongoose";

export interface ICertificate extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  certificate_id: string;
  issued_at: Date;
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}
