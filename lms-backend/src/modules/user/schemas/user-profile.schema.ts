import mongoose from "mongoose";

export const userProfileSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must not exceed 50 characters"],
    },
    last_name: {
      type: String,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name must not exceed 50 characters"],
    },
    avatar: {
      asset_id: { type: String },
      public_id: { type: String },
      public_url: { type: String },
      secure_url: { type: String },
      resource_type: { type: String },
      format: { type: String },
      bytes: { type: Number },
    },
    age: { type: Number, min: [0, "Age must be positive"], max: [150, "Invalid age"] },
    gender: { type: String, trim: true },
  },
  { _id: false }
);
