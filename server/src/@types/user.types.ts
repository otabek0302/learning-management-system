// src/types/user.types.ts

export interface IRegister {
    email: string;
    name: string;
    password: string;
}

export interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export interface IActivationTokenPayload {
    user: IRegister;
    activation_code: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}
