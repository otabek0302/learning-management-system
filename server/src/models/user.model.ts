import { Document, Schema, Model } from "mongoose";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../config/config";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Email regex to validate email format
const emailRegexPattern: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Interface for the User document
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<Object>;
  comparePassword: (password: string) => Promise<boolean>;
  verifyEmailToken: string;
  verifyEmailTokenExpiry: Date;
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

// Schema for User model
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      unique: true,
      lowercase: true,
      match: [emailRegexPattern, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: [6, "Password should be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
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
    verifyEmailToken: {
      type: String,
    },
    verifyEmailTokenExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Password comparison method
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Sign access token
userSchema.methods.SignAccessToken = function (): string {
  return jwt.sign({ id: this._id }, ACCESS_TOKEN as string || '', {
    expiresIn: "5m",
  });
};

// Sign refresh token
userSchema.methods.SignRefreshToken = function (): string {
  return jwt.sign({ id: this._id }, REFRESH_TOKEN as string || '', {
    expiresIn: "2h",
  });
};

// Pre-save middleware to hash the password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;