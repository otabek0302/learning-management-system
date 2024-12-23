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

// src/types/user.types.ts

export interface IUser {
    _id: string;
    email: string;
    name: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: [];
    comparePassword: (password: string) => Promise<boolean>;
    verifyEmailToken: string;
    verifyEmailTokenExpiry: Date;
    forgotPasswordToken: string;
    forgotPasswordTokenExpiry: Date;
    createdAt: Date;
    updatedAt: Date;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

export interface ISocialAuthRequest {
    email: string;
    name: string;
    avatar: {
        public_id: string;
        url: string;
    };
}
