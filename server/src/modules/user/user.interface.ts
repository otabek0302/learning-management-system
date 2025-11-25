import { Document, Schema } from "mongoose";

// User Interface
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
  courses: { _id: Schema.Types.ObjectId; courseId?: Schema.Types.ObjectId }[];
  comparePassword: (password: string) => Promise<boolean>;
  verifyEmailToken?: string;
  verifyEmailTokenExpiry?: Date;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
  toObject(): any;
}

// Register Interface
export interface IRegister {
  name: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
}

// Login Interface
export interface ILogin {
  email: string;
  password: string;
}

// Activation Token Interface
export interface IActivationToken {
  token: string;
  activationCode: string;
}

// Activation Request Interface
export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

// Update User Info Interface
export interface IUpdateUserInfo {
  name?: string;
  email?: string;
  avatar?: string;
}

// Update Password Interface
export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

// Forgot Password Interface
export interface IForgotPassword {
  email: string;
}

// Forgot Password Token Interface
export interface IForgotPasswordToken {
  token: string;
  forgotPasswordCode: string;
}

// Forgot Password Request Interface
export interface IForgotPasswordRequest {
  forgot_password_token: string;
  forgot_password_code: string;
}

// Update User Avatar Interface
export interface IUpdateUserAvatar {
  avatar: string;
}

// Reset Password Interface
export interface IResetPassword {
  password: string;
  resetKey: string;
}

// Update User Role Interface
export interface IUpdateUserRole {
  id: string;
  role: string;
}

// Delete User Interface
export interface IDeleteUser {
  id: string;
}

// Get User By Id Interface
export interface IGetUserById {
  id: string;
}

// Social Auth Interface
export interface ISocialAuthRequest {
  email: string;
  name: string;
  avatar?: string;
}
