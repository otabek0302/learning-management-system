import type { Document, Schema, Types } from "mongoose";

export interface IUserAvatar {
  asset_id?: string;
  public_id?: string;
  public_url?: string;
  secure_url?: string;
  resource_type?: string;
  format?: string;
  bytes?: number;
}

export interface IUserProfile {
  first_name?: string;
  last_name?: string;
  avatar?: IUserAvatar;
  age?: number;
  gender?: string;
}

export interface IUserSecurity {
  account_restricted?: boolean;
  restriction_reason?: string;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
}

export interface IUserInstructor {
  bio?: string;
  headline?: string;
  expertise?: string[];
  qualifications?: string[];
  rating?: number;
}

export interface IUserStudent {
  wishlist?: Schema.Types.ObjectId[];
  courses?: Schema.Types.ObjectId[];
}

export interface IUserPreferences {
  two_factor_authentication_enabled?: boolean;
  email_notifications_enabled?: boolean;
  push_notifications_enabled?: boolean;
  theme?: "light" | "dark";
  timezone?: string;
  language?: string;
}

export interface IUserActivity {
  last_login_at?: Date;
  last_login_ip?: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email?: string;
  phone?: string;
  password?: string;
  role: "student" | "instructor" | "admin";
  status?: "active" | "inactive" | "blocked" | "deleted";
  online: boolean;
  deleted_at?: Date;
  terms_accepted_at?: Date;
  privacy_policy_accepted_at?: Date;

  profile: IUserProfile;
  security: IUserSecurity;
  instructor: IUserInstructor;
  student: IUserStudent;
  preferences: IUserPreferences;
  activity: IUserActivity;

  created_at: Date;
  updated_at: Date;
  comparePassword(password: string): Promise<boolean>;
  signAccessToken(): string;
  signRefreshToken(): string;
}

// ─── Auth (request / payload) ────────────────────────────────────────────────
export interface ISignUpByEmail {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface ISignUpByPhone {
  first_name?: string;
  last_name?: string;
  phone: string;
  password: string;
}

export interface ISignInByEmail {
  email: string;
  password: string;
}

export interface ISignInByPhone {
  phone: string;
  password: string;
}

export interface IVerifyOtp {
  email?: string;
  phone?: string;
  code: string;
}

export interface IResendOtp {
  email?: string;
  phone?: string;
}

export interface IRefreshToken {
  refreshToken?: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  token: string;
  password: string;
}

export type VerificationOtpIdentifier = { email: string; phone?: never } | { phone: string; email?: never };

// ─── Profile & preferences ───────────────────────────────────────────────────
export interface IUpdateProfile {
  first_name?: string;
  last_name?: string;
  avatar?: IUserProfile["avatar"];
  age?: number;
  gender?: string;
}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdatePreferences {
  two_factor_authentication_enabled?: boolean;
  email_notifications_enabled?: boolean;
  push_notifications_enabled?: boolean;
  theme?: "light" | "dark";
  timezone?: string;
  language?: string;
}

// ─── Admin ───────────────────────────────────────────────────────────────────
export interface ICreateUser {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  password: string;
  role?: "student" | "instructor" | "admin";
  send_email_verification?: boolean;
  send_phone_verification?: boolean;
}

export interface IAdminUpdateUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: "student" | "instructor" | "admin";
  status?: "active" | "inactive" | "blocked" | "deleted";
}

export interface IListUsersQuery {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}
