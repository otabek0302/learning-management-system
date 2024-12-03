import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Email regex to validate email format
const emailRegexPattern: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: mongoose.Schema.Types.ObjectId }>;
  comparePassword: (password: string) => Promise<boolean>;
  verifyEmailToken: string;
  verifyEmailTokenExpiry: Date;
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
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
      required: [true, "Please enter a password"],
      minlength: [6, "Password should be at least 6 characters"],
      select: false, // Don't select the password by default in queries
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
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
      required: true,
    },
    verifyEmailTokenExpiry: {
      type: Date,
      required: true,
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

// Pre-save middleware to hash the password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Password hasn't been modified, proceed without hashing
  }
  const salt = await bcrypt.genSalt(10); // Salt the password with a rounds of 10
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;