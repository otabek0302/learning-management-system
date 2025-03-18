import { Document } from "mongoose";
import { ICourse } from "./course.interface";

// User Interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    role: string;
    courses: ICourse[];
}

// Register Interface
export interface IRegister extends IUser {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

// Login Interface
export interface ILogin extends IUser {
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
export interface IUpdateUserInfo extends IUser {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
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