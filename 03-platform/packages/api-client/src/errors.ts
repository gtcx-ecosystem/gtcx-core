import type { ApiErrorCategory, ApiErrorCode } from './types';

export class ApiClientError extends Error {
  status?: number | undefined;
  code: ApiErrorCode;
  category: ApiErrorCategory;
  retryable: boolean;
  override cause?: unknown | undefined;

  constructor(
    message: string,
    options: {
      status?: number;
      code: ApiErrorCode;
      category: ApiErrorCategory;
      retryable: boolean;
      cause?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.code = options.code;
    this.category = options.category;
    this.retryable = options.retryable;
    this.cause = options.cause;
  }
}

export class GTCXError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'GTCXError';
  }
}

export class HttpError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'HttpError';
  }
}

export class AuthError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'AuthError';
  }
}

export class NetworkError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'TimeoutError';
  }
}

export class AbortError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'AbortError';
  }
}

export class SigningError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'SigningError';
  }
}

export class ConfigurationError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'ConfigurationError';
  }
}
