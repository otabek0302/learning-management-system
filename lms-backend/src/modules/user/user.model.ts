import type { IUser } from "./user.interface";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "@config/env.config";

import { userProfileSchema } from "./schemas/user-profile.schema";
import { userSecuritySchema } from "./schemas/user-security.schema";
import { userInstructorSchema } from "./schemas/user-instructor.schema";
import { userStudentSchema } from "./schemas/user-student.schema";
import { userPreferencesSchema } from "./schemas/user-preferences.schema";
import { userActivitySchema } from "./schemas/user-activity.schema";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      minlength: [5, "Email must be at least 5 characters"],
      maxlength: [50, "Email must not exceed 50 characters"],
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      minlength: [10, "Phone number must be at least 10 characters"],
      maxlength: [15, "Phone number must not exceed 15 characters"],
    },
    password: {
      type: String,
      minlength: [6, "Password should be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "deleted"],
      default: "active",
    },
    online: { type: Boolean, default: false },
    deleted_at: { type: Date },
    terms_accepted_at: { type: Date },
    privacy_policy_accepted_at: { type: Date },

    profile: { type: userProfileSchema, default: () => ({}) },
    security: { type: userSecuritySchema, default: () => ({ is_email_verified: false, is_phone_verified: false }) },
    instructor: { type: userInstructorSchema, default: () => ({}) },
    student: { type: userStudentSchema, default: () => ({}) },
    preferences: { type: userPreferencesSchema, default: () => ({}) },
    activity: { type: userActivitySchema, default: () => ({}) },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.signAccessToken = function (): string {
  return jwt.sign({ _id: this._id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
};

userSchema.methods.signRefreshToken = function (): string {
  return jwt.sign({ _id: this._id }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
