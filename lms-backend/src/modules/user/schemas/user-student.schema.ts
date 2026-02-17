import mongoose from "mongoose";

export const userStudentSchema = new mongoose.Schema(
  {
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
  },
  { _id: false }
);
