import type { Document, Schema } from "mongoose";

export interface IInvoiceItem {
  course: Schema.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IInvoice extends Document {
  user: Schema.Types.ObjectId;
  invoice_number: string;
  items: IInvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  status: "draft" | "issued" | "paid" | "cancelled";
  issued_at?: Date;
  due_at?: Date;
  paid_at?: Date;
  payment?: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}
