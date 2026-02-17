import mongoose from "mongoose";

export const userInstructorSchema = new mongoose.Schema(
  {
    bio: { type: String, trim: true },
    headline: { type: String, trim: true, maxlength: 200 },
    expertise: [{ type: String, trim: true }],
    qualifications: [{ type: String, trim: true }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { _id: false }
);
