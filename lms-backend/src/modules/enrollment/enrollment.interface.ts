import type { Document, Schema } from "mongoose";

export interface IEnrollment extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  price: number;
  currency: string;
  paid_at: Date;
  status: "active" | "expired" | "refunded";
  coupon_code?: string;
  created_at: Date;
  updated_at: Date;
}
