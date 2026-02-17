import type { IInvoice } from "./invoice.interface";
import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, default: 1, min: 1 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema<IInvoice>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    invoice_number: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
    },
    items: { type: [invoiceItemSchema], required: true, default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: [true, "Total is required"], min: 0 },
    currency: { type: String, default: "USD", trim: true },
    status: {
      type: String,
      enum: ["draft", "issued", "paid", "cancelled"],
      default: "draft",
    },
    issued_at: { type: Date },
    due_at: { type: Date },
    paid_at: { type: Date },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

invoiceSchema.index({ user: 1 });
invoiceSchema.index({ invoice_number: 1 });
invoiceSchema.index({ status: 1 });

export const InvoiceModel = mongoose.model<IInvoice>("Invoice", invoiceSchema);
