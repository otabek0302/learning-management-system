import { User } from "./user";

export interface RegistrationResponse {
    success: boolean;
    message: string;
    activationToken: string;
}

export interface RegistrationData {
    name: string;
    email: string;
    password: string;
}

export interface ActivationResponse {
    success: boolean;
    message: string;
}

export interface ActivationData {
    activation_token: string;
    activation_code: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user: User;
    accessToken: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    accessToken: string;
}