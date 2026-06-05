/**
 * Timeout wrapper — aborts a promise if it doesn't resolve within a deadline.
 *
 * Uses AbortController for cancellation signaling where possible.
 */

export interface TimeoutConfig {
  timeoutMs: number;
  /** Optional callback invoked when timeout fires (before rejection) */
  onTimeout?: () => void;
}

export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Operation timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Wrap a function with a timeout.
 *
 * If the function accepts an AbortSignal, the signal will be aborted on timeout.
 * Even if the function does not respect the signal, the timeout will reject
 * via Promise.race.
 */
export async function withTimeout<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  config: TimeoutConfig
): Promise<T> {
  const { timeoutMs, onTimeout } = config;

  const controller = new AbortController();

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      controller.abort();
      onTimeout?.();
      reject(new TimeoutError(timeoutMs));
    }, timeoutMs);
  });

  return await Promise.race([fn(controller.signal), timeoutPromise]);
}
