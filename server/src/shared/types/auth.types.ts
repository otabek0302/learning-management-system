/** JWT Token Payload */
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

/** Forgot Password Token Payload */
export interface ForgotPasswordTokenPayload {
  user: {
    name: string;
    email: string;
    id?: string;
  };
  forgotPasswordCode: string;
  iat?: number;
  exp?: number;
}

/** Forgot Password Token Data */
export interface ForgotPasswordTokenData {
  token: string;
  forgotPasswordCode: string;
}

