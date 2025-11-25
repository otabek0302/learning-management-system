import type { ILayout } from "./layout.interface";

import { Schema, Model } from "mongoose";
import mongoose from "mongoose";

/* ---------------------- Layout Schema ---------------------- */
const layoutSchema = new Schema<ILayout>(
  {
    type: {
      type: String,
      required: [true, "Layout type is required"],
      enum: ["banner", "faq", "categories"],
      unique: true,
    },
    banner: {
      title: {
        type: String,
        trim: true,
        maxlength: [200, "Title must not exceed 200 characters"],
      },
      subTitle: {
        type: String,
        trim: true,
        maxlength: [500, "Subtitle must not exceed 500 characters"],
      },
      image: {
        public_id: { type: String },
        url: { type: String },
      },
    },
    faq: [
      {
        question: {
          type: String,
          required: [true, "FAQ question is required"],
          trim: true,
          maxlength: [500, "Question must not exceed 500 characters"],
        },
        answer: {
          type: String,
          required: [true, "FAQ answer is required"],
          trim: true,
          maxlength: [2000, "Answer must not exceed 2000 characters"],
        },
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

const LayoutModel: Model<ILayout> = mongoose.model<ILayout>("Layout", layoutSchema);

export default LayoutModel;

