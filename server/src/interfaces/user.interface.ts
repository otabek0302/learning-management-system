import { IUser } from "../models/user.model";

export interface IRegister extends IUser {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

export interface ILogin extends IUser {
    email: string;
    password: string;
}

export interface IActivationToken {
    token: string;
    activationCode: string;
}

export interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export interface IUpdateUserInfo extends IUser {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

export interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IForgotPassword {
    email: string;
}

export interface IForgotPasswordToken {
    token: string;
    forgotPasswordCode: string;
}

export interface IForgotPasswordRequest {
    forgot_password_token: string;
    forgot_password_code: string;
}

export interface IUpdateUserAvatar {
    avatar: string;
}

export interface IResetPassword {
    password: string;
    resetKey: string;
}