import type { P2PErrorCode } from './types';

export class P2PError extends Error {
  code: P2PErrorCode;
  retryable: boolean;

  constructor(message: string, code: P2PErrorCode, retryable: boolean) {
    super(message);
    this.name = 'P2PError';
    this.code = code;
    this.retryable = retryable;
  }
}

export class RateLimitError extends P2PError {
  constructor(message: string) {
    super(message, 'RATE_LIMIT', true);
    this.name = 'RateLimitError';
  }
}

export class TransportError extends P2PError {
  constructor(message: string) {
    super(message, 'TRANSPORT', true);
    this.name = 'TransportError';
  }
}

export class ConfigurationError extends P2PError {
  constructor(message: string) {
    super(message, 'CONFIG', false);
    this.name = 'ConfigurationError';
  }
}
