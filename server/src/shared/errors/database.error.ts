import { BaseError } from './base.error';

/** Database Error - Used when database operations fail (500 Internal Server Error) */
export class DatabaseError extends BaseError {
  readonly status_code: number = 500;
  readonly error_code: string = "DATABASE_ERROR";

  constructor(message: string = "Database operation failed", context?: Record<string, unknown>) {
    super(message, context);
  }
}

