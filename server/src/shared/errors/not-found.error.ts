import { BaseError } from "./base.error";

/** Not Found Error - Used when a resource is not found (404 Not Found) */
export class NotFoundError extends BaseError {
  readonly status_code: number = 404;
  readonly error_code: string = "NOT_FOUND_ERROR";

  constructor(resource: string = "Resource", identifier?: string, context?: Record<string, unknown>) {
    const message = identifier ? `${resource} with identifier '${identifier}' not found` : `${resource} not found`;
    super(message, context);
  }
}

