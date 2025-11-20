import { Schema, model, Document, Types } from "mongoose";

export interface ICertificate extends Document {
  userId: string;
  courseId: Types.ObjectId | string;
  certificateId: string;
  issuedAt: Date;
  pdfUrl?: string;
}

const certificateSchema = new Schema<ICertificate>(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, required: true, ref: "Course", index: true },
    certificateId: { type: String, unique: true, index: true },
    issuedAt: { type: Date, default: Date.now },
    pdfUrl: { type: String },
  },
  { timestamps: true }
);

certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Certificate = model<ICertificate>("Certificate", certificateSchema);
