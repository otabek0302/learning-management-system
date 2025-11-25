import { BaseError } from './base.error';

/** Business Logic Error - Used when business rules are violated (400 Bad Request) */
export class LogicError extends BaseError {
  readonly status_code: number = 400;
  readonly error_code: string = "LOGIC_ERROR";

  constructor(message: string = "Logic error", context?: Record<string, unknown>) {
    super(message, context);
  }
}
