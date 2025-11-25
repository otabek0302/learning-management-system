import { Schema, Model } from "mongoose";
import mongoose from "mongoose";
import type { ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name must not exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must not exceed 500 characters"],
    },
  },
  { timestamps: true }
);

const CategoryModel: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default CategoryModel;

