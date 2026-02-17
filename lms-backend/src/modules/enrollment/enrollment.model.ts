import type { IEnrollment } from "./enrollment.interface";
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema<IEnrollment>(
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
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    currency: { type: String, default: "USD", trim: true },
    paid_at: { type: Date, required: [true, "Paid date is required"], default: Date.now },
    status: {
      type: String,
      enum: ["active", "expired", "refunded"],
      default: "active",
    },
    coupon_code: { type: String, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1 });
enrollmentSchema.index({ course: 1 });

export const EnrollmentModel = mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
