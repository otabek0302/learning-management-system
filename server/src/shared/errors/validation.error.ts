import { BaseError } from "./base.error";

/** Validation Error - Used when input validation fails (400 Bad Request) */
export class ValidationError extends BaseError {
  readonly status_code: number = 400;
  readonly error_code: string = "VALIDATION_ERROR";
  public readonly fields?: Record<string, string[]>;

  constructor(message: string = "Validation failed", fields?: Record<string, string[]>, context?: Record<string, unknown>) {
    super(message, context);
    this.fields = fields;
  }

  toJSON(): Record<string, unknown> {
    return { ...super.toJSON(), ...(this.fields && { fields: this.fields }) };
  }
}

