import { BaseError } from './base.error';

/** External Service Error - Used when an external service fails (502 Bad Gateway) */
export class ExternalServiceError extends BaseError {
  readonly status_code: number = 502;
  readonly error_code: string = "EXTERNAL_SERVICE_ERROR";

  constructor(service_name: string, message?: string, context?: Record<string, unknown>) {
    super(message || `External service error: ${service_name}`, { service_name, ...context });
  }
}

