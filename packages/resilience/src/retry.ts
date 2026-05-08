/**
 * Adaptive retry with configurable strategy, jitter, and retryability predicate.
 *
 * Strategies:
 * - fixed: constant delay between attempts
 * - exponential: delay doubles each attempt (base * 2^attempt)
 * - adaptive: exponential capped at maxDelayMs
 *
 * Jitter modes:
 * - none: exact delay
 * - full: random delay between 0 and calculated delay
 * - decorrelated: random delay between base and 3*previous (AWS recommended)
 */

export type RetryStrategy = 'fixed' | 'exponential' | 'adaptive';
export type JitterMode = 'none' | 'full' | 'decorrelated';

export interface RetryPolicy {
  strategy?: RetryStrategy;
  baseDelayMs?: number;
  maxDelayMs?: number;
  maxRetries?: number;
  jitter?: JitterMode;
  /** Custom predicate to decide if an error is retryable */
  retryable?: (error: unknown) => boolean;
}

/** Generate a random float in [0, 1). Jitter does not need cryptographic randomness. */
function cryptoRandom01(): number {
  // eslint-disable-next-line no-restricted-properties
  return Math.random();
}

const DEFAULT_POLICY: Required<RetryPolicy> = {
  strategy: 'adaptive',
  baseDelayMs: 250,
  maxDelayMs: 2_000,
  maxRetries: 3,
  jitter: 'decorrelated',
  retryable: () => true,
};

/** Calculate delay for a given attempt (0-indexed). Pure function. */
export function calculateDelay(attempt: number, policy: RetryPolicy = {}): number {
  const { strategy, baseDelayMs, maxDelayMs, jitter } = { ...DEFAULT_POLICY, ...policy };

  let delay: number;

  switch (strategy) {
    case 'fixed':
      delay = baseDelayMs;
      break;
    case 'exponential':
      delay = baseDelayMs * 2 ** attempt;
      break;
    case 'adaptive':
    default:
      delay = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);
      break;
  }

  switch (jitter) {
    case 'full': {
      const r = cryptoRandom01();
      delay = r * delay;
      break;
    }
    case 'decorrelated': {
      // AWS recommended: sleep = min(max, random(base, sleep * 3))
      const upper = Math.min(delay * 3, maxDelayMs);
      const r = cryptoRandom01();
      delay = baseDelayMs + r * (upper - baseDelayMs);
      break;
    }
    case 'none':
    default:
      break;
  }

  return Math.max(0, Math.round(delay));
}

/** Determine if an error should be retried. */
export function isRetryableError(error: unknown, policy: RetryPolicy = {}): boolean {
  const { retryable } = { ...DEFAULT_POLICY, ...policy };
  if (retryable) {
    return retryable(error);
  }
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function with retry semantics.
 *
 * @returns A promise that resolves with the function's result or rejects with the last error.
 */
export async function withRetry<T>(fn: () => Promise<T>, policy: RetryPolicy = {}): Promise<T> {
  const { maxRetries } = { ...DEFAULT_POLICY, ...policy };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt >= maxRetries;
      if (isLastAttempt || !isRetryableError(error, policy)) {
        throw error;
      }

      const delay = calculateDelay(attempt, policy);
      await sleep(delay);
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error('Retry exhausted');
}
