/**
 * Secure storage error types.
 */

export class SecureStorageError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'SecureStorageError';
  }
}
