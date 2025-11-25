import { BaseError } from "./base.error";

/** Conflict Error - Used when a resource conflict occurs (409 Conflict) */
export class ConflictError extends BaseError {
  readonly status_code: number = 409;
  readonly error_code: string = "CONFLICT_ERROR";

  constructor(message: string = "Resource conflict", context?: Record<string, unknown>) {
    super(message, context);
  }
}
