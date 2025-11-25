export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified?: boolean;
  courses: { _id?: string; courseId?: { name: string; _id: string }; enrolledAt?: string }[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
}

export interface UpdateUserData {
  name: string;
  email: string;
  password?: string;
  avatar?: {
    public_id: string;
    url: string;
  };
}

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  resetKey: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

