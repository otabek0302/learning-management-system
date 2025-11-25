export abstract class BaseError extends Error {
  abstract readonly status_code: number;
  abstract readonly error_code: string;

  readonly timestamp: string;
  readonly context?: Record<string, unknown>;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);

    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      error_code: this.error_code,
      status_code: this.status_code,
      timestamp: this.timestamp,
      ...(this.context && { context: this.context }),
    };
  }
}
