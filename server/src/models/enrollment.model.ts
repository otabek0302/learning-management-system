import { Schema, model, Document } from "mongoose";

export interface IEnrollment extends Document {
  userId: string;
  courseId: string;
  status: "active" | "cancelled";
  purchasedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
      index: true,
    },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ createdAt: -1 });

export const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
