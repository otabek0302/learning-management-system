import { BaseError } from "./base.error";

/** Authentication Error - Used when authentication fails (401 Unauthorized) */
export class AuthenticationError extends BaseError {
  readonly status_code: number = 401;
  readonly error_code: string = "AUTHENTICATION_ERROR";

  constructor(message: string = "Authentication failed", context?: Record<string, unknown>) {
    super(message, context);
  }
}

/** Authorization Error - Used when user lacks permissions (403 Forbidden) */
export class AuthorizationError extends BaseError {
  readonly status_code: number = 403;
  readonly error_code: string = "AUTHORIZATION_ERROR";

  constructor(message: string = "Insufficient permissions", context?: Record<string, unknown>) {
    super(message, context);
  }
}

