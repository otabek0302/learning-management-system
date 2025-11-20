import { Schema, model, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  active: boolean;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercentage: { type: Number, required: true, min: 1, max: 100 },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);
