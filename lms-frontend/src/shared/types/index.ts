/** Auth request/response types (aligned with backend auth routes) */
export interface RegistrationByEmailData {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface RegistrationByPhoneData {
  first_name?: string;
  last_name?: string;
  phone: string;
  password: string;
}

export interface VerifyOtpData {
  email?: string;
  phone?: string;
  code: string;
}

export interface ResendOtpData {
  email?: string;
  phone?: string;
}

export interface LoginByEmailData {
  email: string;
  password: string;
}

export interface LoginByPhoneData {
  phone: string;
  password: string;
}

export interface User {
  _id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role: string;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}
