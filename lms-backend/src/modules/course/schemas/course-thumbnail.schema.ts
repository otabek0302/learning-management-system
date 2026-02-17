import mongoose from "mongoose";

export const courseThumbnailSchema = new mongoose.Schema(
  {
    asset_id: { type: String },
    public_id: { type: String },
    public_url: { type: String },
    secure_url: { type: String },
    resource_type: { type: String },
    format: { type: String },
  },
  { _id: false }
);
