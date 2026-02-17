import type { ICertificate } from "./certificate.interface";
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema<ICertificate>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    certificate_id: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true,
      trim: true,
    },
    issued_at: { type: Date, required: true, default: Date.now },
    pdf_url: { type: String, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

certificateSchema.index({ user: 1, course: 1 }, { unique: true });
certificateSchema.index({ certificate_id: 1 });

export const CertificateModel = mongoose.model<ICertificate>("Certificate", certificateSchema);
