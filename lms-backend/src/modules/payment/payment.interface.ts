import type { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  user: Schema.Types.ObjectId;
  enrollment?: Schema.Types.ObjectId;
  invoice?: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: "card" | "paypal" | "bank" | "other";
  payment_provider_id?: string;
  metadata?: Record<string, unknown>;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}
