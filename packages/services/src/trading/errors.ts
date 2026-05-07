/**
 * Trading service error classes.
 */

export class LicenseValidationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'LicenseValidationError';
  }
}

export class ComplianceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ComplianceError';
  }
}

export class MaxValueError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'MaxValueError';
  }
}

/** Service validation error. Shared across all GTCX services. */
export class ValidationError extends Error {
  readonly service: string;
  constructor(message: string, options?: { cause?: unknown; service?: string }) {
    super(message, options);
    this.name = 'ValidationError';
    this.service = options?.service ?? 'trading';
  }
}

export class TradingError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'TradingError';
  }
}

export function toErrorCause(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
