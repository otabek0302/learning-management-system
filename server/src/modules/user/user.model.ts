import type { IUser } from "./user.interface";

import { Schema, Model } from "mongoose";
import { env } from "../../config/env";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ---------------------- Comment Schema ---------------------- */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [6, "Password should be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: { type: String },
      url: { type: String },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      },
    ],
    verifyEmailToken: { type: String },
    verifyEmailTokenExpiry: { type: Date },
    forgotPasswordToken: { type: String },
    forgotPasswordTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

/* ---------------------- Methods ---------------------- */
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

/* ---------------------- Sign Access Token ---------------------- */
userSchema.methods.SignAccessToken = function (): string {
  return jwt.sign({ id: this._id }, env.ACCESS_TOKEN, {
    expiresIn: Math.floor(env.ACCESS_TOKEN_EXPIRATION / 1000),
  });
};

/* ---------------------- Sign Refresh Token ---------------------- */
userSchema.methods.SignRefreshToken = function (): string {
  return jwt.sign({ id: this._id }, env.REFRESH_TOKEN, {
    expiresIn: Math.floor(env.REFRESH_TOKEN_EXPIRATION / 1000),
  });
};

/* ---------------------- Pre Save Hook ---------------------- */
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserModel;
