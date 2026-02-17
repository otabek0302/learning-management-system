import type { ICategory } from "./category.interface";
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name must not exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    icon: { type: String, trim: true },
    image: { type: String, trim: true },
    order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ order: 1 });

export const CategoryModel = mongoose.model<ICategory>("Category", categorySchema);
