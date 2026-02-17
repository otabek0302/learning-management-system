import type { IPayment } from "./payment.interface";
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    amount: { type: Number, required: [true, "Amount is required"], min: 0 },
    currency: { type: String, default: "USD", trim: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: ["card", "paypal", "bank", "other"],
      required: [true, "Payment method is required"],
    },
    payment_provider_id: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    paid_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ payment_provider_id: 1 });

export const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);
