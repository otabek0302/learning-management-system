export class ErrorHandler extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly data?: Record<string, unknown>;

  constructor(message: string, statusCode: number, data?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.data = data;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ErrorHandler {
  constructor(message: string, data?: Record<string, unknown>) {
    super(message, 400, data);
  }
}

export class UnauthorizedError extends ErrorHandler {
  constructor(message = "Unauthorized", data?: Record<string, unknown>) {
    super(message, 401, data);
  }
}

export class ForbiddenError extends ErrorHandler {
  constructor(message = "Forbidden", data?: Record<string, unknown>) {
    super(message, 403, data);
  }
}

export class NotFoundError extends ErrorHandler {
  constructor(message = "Resource not found", data?: Record<string, unknown>) {
    super(message, 404, data);
  }
}

export class ConflictError extends ErrorHandler {
  constructor(message: string, data?: Record<string, unknown>) {
    super(message, 409, data);
  }
}

export class ValidationError extends ErrorHandler {
  constructor(message: string, data?: Record<string, unknown>) {
    super(message, 422, data);
  }
}

export class TooManyRequestsError extends ErrorHandler {
  constructor(message = "Too many requests", data?: Record<string, unknown>) {
    super(message, 429, data);
  }
}

export class InternalServerError extends ErrorHandler {
  constructor(message = "Internal server error", data?: Record<string, unknown>) {
    super(message, 500, data);
  }
}
