import { describe, it, expect, vi } from 'vitest';

import { withRetry, calculateDelay, isRetryableError, type RetryPolicy } from '../src/retry';

describe('calculateDelay', () => {
  it('returns fixed delay with no jitter', () => {
    const delay = calculateDelay(2, { strategy: 'fixed', jitter: 'none', baseDelayMs: 100 });
    expect(delay).toBe(100);
  });

  it('returns exponential delay with no jitter', () => {
    const policy: RetryPolicy = { strategy: 'exponential', jitter: 'none', baseDelayMs: 100 };
    expect(calculateDelay(0, policy)).toBe(100);
    expect(calculateDelay(1, policy)).toBe(200);
    expect(calculateDelay(2, policy)).toBe(400);
    expect(calculateDelay(3, policy)).toBe(800);
  });

  it('caps adaptive delay at maxDelayMs', () => {
    const policy: RetryPolicy = {
      strategy: 'adaptive',
      jitter: 'none',
      baseDelayMs: 100,
      maxDelayMs: 500,
    };
    expect(calculateDelay(0, policy)).toBe(100);
    expect(calculateDelay(1, policy)).toBe(200);
    expect(calculateDelay(2, policy)).toBe(400);
    expect(calculateDelay(3, policy)).toBe(500); // capped
    expect(calculateDelay(10, policy)).toBe(500); // capped
  });

  it('applies full jitter (random between 0 and delay)', () => {
    const policy: RetryPolicy = { strategy: 'fixed', jitter: 'full', baseDelayMs: 1000 };
    for (let i = 0; i < 20; i++) {
      const delay = calculateDelay(0, policy);
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThanOrEqual(1000);
    }
  });

  it('applies decorrelated jitter', () => {
    const policy: RetryPolicy = {
      strategy: 'adaptive',
      jitter: 'decorrelated',
      baseDelayMs: 100,
      maxDelayMs: 1000,
    };
    for (let i = 0; i < 20; i++) {
      const delay = calculateDelay(2, policy);
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(1000);
    }
  });

  it('returns non-negative delays', () => {
    const policy: RetryPolicy = { baseDelayMs: 0, maxDelayMs: 0 };
    expect(calculateDelay(0, policy)).toBe(0);
  });
});

describe('isRetryableError', () => {
  it('uses custom predicate when provided', () => {
    const error = new Error('transient');
    expect(
      isRetryableError(error, { retryable: (e) => (e as Error).message === 'transient' })
    ).toBe(true);
    expect(isRetryableError(error, { retryable: () => false })).toBe(false);
  });

  it('defaults to retryable', () => {
    expect(isRetryableError(new Error('anything'))).toBe(true);
  });

  it('defaults to retryable when predicate is explicitly undefined', () => {
    expect(isRetryableError(new Error('anything'), { retryable: undefined })).toBe(true);
  });
});

describe('withRetry', () => {
  it('returns result on first success', async () => {
    const result = await withRetry(() => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it('retries on failure until success', async () => {
    let attempts = 0;
    const result = await withRetry(() => {
      attempts++;
      if (attempts < 3) return Promise.reject(new Error(`attempt ${attempts}`));
      return Promise.resolve('success');
    });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('throws last error after max retries', async () => {
    let attempts = 0;
    await expect(
      withRetry(
        () => {
          attempts++;
          return Promise.reject(new Error(`attempt ${attempts}`));
        },
        { maxRetries: 2 }
      )
    ).rejects.toThrow('attempt 3');
    expect(attempts).toBe(3); // initial + 2 retries
  });

  it('does not retry non-retryable errors', async () => {
    let attempts = 0;
    const fatalError = new Error('fatal');
    await expect(
      withRetry(
        () => {
          attempts++;
          return Promise.reject(fatalError);
        },
        { retryable: (e) => (e as Error).message !== 'fatal' }
      )
    ).rejects.toThrow('fatal');
    expect(attempts).toBe(1);
  });

  it('uses custom retry policy', async () => {
    let attempts = 0;
    const fn = vi.fn(() => {
      attempts++;
      if (attempts < 2) return Promise.reject(new Error('fail'));
      return Promise.resolve('ok');
    });

    const result = await withRetry(fn, { maxRetries: 5, baseDelayMs: 10 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('waits between retries', async () => {
    let attempts = 0;
    const start = Date.now();
    await withRetry(
      () => {
        attempts++;
        if (attempts < 2) return Promise.reject(new Error('fail'));
        return Promise.resolve('ok');
      },
      { maxRetries: 2, baseDelayMs: 50, jitter: 'none' }
    );
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // at least one delay
  });

  it('succeeds immediately without delay', async () => {
    const start = Date.now();
    await withRetry(() => Promise.resolve(1), { baseDelayMs: 10_000 });
    expect(Date.now() - start).toBeLessThan(50);
  });
});
