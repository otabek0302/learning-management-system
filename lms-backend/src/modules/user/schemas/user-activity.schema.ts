import mongoose from "mongoose";

export const userActivitySchema = new mongoose.Schema(
  {
    last_login_at: { type: Date },
    last_login_ip: { type: String },
  },
  { _id: false }
);
