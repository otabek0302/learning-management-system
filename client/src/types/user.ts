export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    role: string;
    courses: { _id: string }[];
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

export interface LoginData {
    email: string;
    password: string;
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
