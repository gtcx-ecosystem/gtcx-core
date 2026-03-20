import { describe, it, expect, vi } from 'vitest';

import {
  generateId,
  generateCorrelationId,
  generateIdempotencyKey,
  simpleHash,
  sanitizeKeys,
  redactPII,
  sanitizeForLogging,
  RateLimiter,
  calculateBackoffDelay,
  sleep,
  withRetry,
  isValidUUID,
  isValidISODate,
  clamp,
} from '../src/internal/utils';

// ---------------------------------------------------------------------------
// ID Generation
// ---------------------------------------------------------------------------

describe('generateId', () => {
  it('returns string with the given prefix', () => {
    const id = generateId('test');
    expect(id).toMatch(/^test_/);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateId('u')));
    expect(ids.size).toBe(50);
  });
});

describe('generateCorrelationId', () => {
  it('returns string starting with corr_', () => {
    expect(generateCorrelationId()).toMatch(/^corr_/);
  });
});

describe('generateIdempotencyKey', () => {
  it('returns string starting with idem_', () => {
    const key = generateIdempotencyKey('register', 'lot-1');
    expect(key).toMatch(/^idem_/);
  });

  it('includes timestamp component', () => {
    const key = generateIdempotencyKey('op');
    const parts = key.split('_');
    const ts = Number(parts[parts.length - 1]);
    expect(ts).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

describe('simpleHash', () => {
  it('returns a hex string', () => {
    const hash = simpleHash('hello');
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  it('is deterministic', () => {
    expect(simpleHash('test')).toBe(simpleHash('test'));
  });

  it('produces different hashes for different inputs', () => {
    expect(simpleHash('a')).not.toBe(simpleHash('b'));
  });
});

// ---------------------------------------------------------------------------
// sanitizeKeys
// ---------------------------------------------------------------------------

describe('sanitizeKeys', () => {
  it('removes __proto__ key', () => {
    // We create a plain object with __proto__ as own property
    const input = Object.create(null);
    input.safe = 1;
    input['__proto__'] = { bad: true };
    const result = sanitizeKeys(input);
    expect(result.safe).toBe(1);
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false);
  });

  it('removes constructor and prototype keys', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: any = { constructor: 'evil', prototype: 'bad', ok: 'fine' };
    const result = sanitizeKeys(input);
    expect(result.ok).toBe('fine');
    expect(Object.prototype.hasOwnProperty.call(result, 'constructor')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(result, 'prototype')).toBe(false);
  });

  it('recursively sanitizes nested objects', () => {
    const input = Object.create(null);
    input.safe = 1;
    const nested = Object.create(null);
    nested.ok = true;
    nested['__proto__'] = 'removed';
    input.nested = nested;
    const result = sanitizeKeys(input);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).nested.ok).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Object.prototype.hasOwnProperty.call((result as any).nested, '__proto__')).toBe(false);
  });

  it('handles arrays with nested objects', () => {
    const input = {
      items: [{ good: 1, constructor: 'bad' }, { fine: 2 }] as Record<string, unknown>[],
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = sanitizeKeys(input as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (result as any).items;
    expect(items[0].good).toBe(1);
    expect(Object.prototype.hasOwnProperty.call(items[0], 'constructor')).toBe(false);
    expect(items[1].fine).toBe(2);
  });

  it('handles circular references', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: any = { a: 1 };
    input.self = input;
    const result = sanitizeKeys(input);
    expect(result.a).toBe(1);
    expect(result.self).toEqual({});
  });

  it('enforces maxDepth', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deep: any = { l1: { l2: { l3: { l4: { l5: 'deep' } } } } };
    const result = sanitizeKeys(deep, 2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).l1.l2).toEqual({});
  });

  it('preserves primitive values', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input = { str: 'hello', num: 42, bool: true, nil: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = sanitizeKeys(input as any);
    expect(result.str).toBe('hello');
    expect(result.num).toBe(42);
    expect(result.bool).toBe(true);
  });

  it('handles empty objects', () => {
    expect(sanitizeKeys({})).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// redactPII
// ---------------------------------------------------------------------------

describe('redactPII', () => {
  it('redacts email addresses', () => {
    expect(redactPII('Contact user@example.com for info')).toBe('Contact [REDACTED] for info');
  });

  it('redacts phone numbers', () => {
    expect(redactPII('Call 555-123-4567')).toBe('Call [REDACTED]');
  });

  it('redacts SSN patterns', () => {
    expect(redactPII('SSN: 123-45-6789')).toBe('SSN: [REDACTED]');
  });

  it('redacts IP addresses', () => {
    expect(redactPII('IP: 192.168.1.1')).toBe('IP: [REDACTED]');
  });

  it('does not modify clean strings', () => {
    const clean = 'Hello world, commodity gold weight 100g';
    expect(redactPII(clean)).toBe(clean);
  });

  it('handles multiple PII items', () => {
    const input = 'Email: test@x.com, Phone: 555-111-2222';
    const result = redactPII(input);
    expect(result).not.toContain('test@x.com');
    expect(result).not.toContain('555-111-2222');
  });

  it('handles empty string', () => {
    expect(redactPII('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// sanitizeForLogging
// ---------------------------------------------------------------------------

describe('sanitizeForLogging', () => {
  it('redacts PII keys', () => {
    const result = sanitizeForLogging({
      email: 'user@example.com',
      name: 'John',
      password: 'secret',
      token: 'abc123',
      ok: 'fine',
    });
    expect(result['email']).toBe('[REDACTED]');
    expect(result['name']).toBe('[REDACTED]');
    expect(result['password']).toBe('[REDACTED]');
    expect(result['token']).toBe('[REDACTED]');
    expect(result['ok']).toBe('fine');
  });

  it('truncates long strings', () => {
    const long = 'x'.repeat(300);
    const result = sanitizeForLogging({ text: long });
    expect((result['text'] as string).length).toBeLessThan(300);
    expect((result['text'] as string).endsWith('...')).toBe(true);
  });

  it('preserves null and undefined', () => {
    const result = sanitizeForLogging({ a: null, b: undefined });
    expect(result['a']).toBeNull();
    expect(result['b']).toBeUndefined();
  });

  it('preserves numbers and booleans', () => {
    const result = sanitizeForLogging({ count: 42, active: true });
    expect(result['count']).toBe(42);
    expect(result['active']).toBe(true);
  });

  it('handles large arrays by summarizing', () => {
    const arr = Array.from({ length: 20 }, (_, i) => i);
    const result = sanitizeForLogging({ items: arr });
    expect(result['items']).toBe('[Array(20)]');
  });

  it('handles small arrays', () => {
    const result = sanitizeForLogging({ items: [1, 2, 3] });
    expect(result['items']).toEqual([1, 2, 3]);
  });

  it('recurses into nested objects', () => {
    const result = sanitizeForLogging({
      nested: { value: 'ok', email: 'hidden@test.com' },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result['nested'] as any).value).toBe('ok');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result['nested'] as any).email).toBe('[REDACTED]');
  });

  it('truncates at maxDepth', () => {
    const deep = { l1: { l2: { l3: { l4: 'deep' } } } };
    const result = sanitizeForLogging(deep, 2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result['l1'] as any).l2).toEqual({ _truncated: true });
  });

  it('redacts PII in string values', () => {
    const result = sanitizeForLogging({
      message: 'Sent to user@example.com',
    });
    expect(result['message']).toContain('[REDACTED]');
    expect(result['message']).not.toContain('user@example.com');
  });
});

// ---------------------------------------------------------------------------
// RateLimiter
// ---------------------------------------------------------------------------

describe('RateLimiter', () => {
  it('allows requests within limit', () => {
    const limiter = new RateLimiter(3, 60000);
    expect(limiter.isAllowed('key1')).toBe(true);
    expect(limiter.isAllowed('key1')).toBe(true);
    expect(limiter.isAllowed('key1')).toBe(true);
  });

  it('blocks requests over limit', () => {
    const limiter = new RateLimiter(2, 60000);
    limiter.isAllowed('key1');
    limiter.isAllowed('key1');
    expect(limiter.isAllowed('key1')).toBe(false);
  });

  it('tracks different keys independently', () => {
    const limiter = new RateLimiter(1, 60000);
    expect(limiter.isAllowed('a')).toBe(true);
    expect(limiter.isAllowed('b')).toBe(true);
    expect(limiter.isAllowed('a')).toBe(false);
    expect(limiter.isAllowed('b')).toBe(false);
  });

  it('getRemaining returns correct count', () => {
    const limiter = new RateLimiter(5, 60000);
    expect(limiter.getRemaining('key1')).toBe(5);
    limiter.isAllowed('key1');
    expect(limiter.getRemaining('key1')).toBe(4);
  });

  it('getRemaining returns maxRequests for unknown key', () => {
    const limiter = new RateLimiter(10, 60000);
    expect(limiter.getRemaining('unknown')).toBe(10);
  });

  it('getResetTime returns a timestamp', () => {
    const limiter = new RateLimiter(5, 60000);
    limiter.isAllowed('key1');
    const resetTime = limiter.getResetTime('key1');
    expect(resetTime).toBeGreaterThan(Date.now() - 1000);
  });

  it('resets after window expires', () => {
    const limiter = new RateLimiter(1, 100);
    limiter.isAllowed('key1');
    expect(limiter.isAllowed('key1')).toBe(false);

    // Mock time passing
    vi.useFakeTimers();
    vi.advanceTimersByTime(200);
    expect(limiter.isAllowed('key1')).toBe(true);
    vi.useRealTimers();
  });

  it('cleanup removes expired entries', () => {
    vi.useFakeTimers();
    const limiter = new RateLimiter(5, 100);
    limiter.isAllowed('key1');
    limiter.isAllowed('key2');

    vi.advanceTimersByTime(200);
    limiter.cleanup();

    // After cleanup, should have full capacity
    expect(limiter.getRemaining('key1')).toBe(5);
    expect(limiter.getRemaining('key2')).toBe(5);
    vi.useRealTimers();
  });

  it('periodic cleanup via cleanupEveryNCalls', () => {
    const limiter = new RateLimiter(1000, 60000, { cleanupEveryNCalls: 3 });
    const cleanupSpy = vi.spyOn(limiter, 'cleanup');

    limiter.isAllowed('a');
    limiter.isAllowed('b');
    expect(cleanupSpy).not.toHaveBeenCalled();

    limiter.isAllowed('c'); // 3rd call triggers cleanup
    expect(cleanupSpy).toHaveBeenCalledTimes(1);

    cleanupSpy.mockRestore();
  });

  it('destroy clears interval timer', () => {
    const limiter = new RateLimiter(100, 60000, { cleanupIntervalMs: 1000 });
    // Should not throw
    limiter.destroy();
    limiter.destroy(); // idempotent
  });
});

// ---------------------------------------------------------------------------
// calculateBackoffDelay
// ---------------------------------------------------------------------------

describe('calculateBackoffDelay', () => {
  it('returns base delay for first attempt (approximately)', () => {
    const delay = calculateBackoffDelay(1, { baseDelayMs: 1000, backoffMultiplier: 2 });
    // 1000 * 2^0 = 1000, with ±10% jitter: 900-1100
    expect(delay).toBeGreaterThanOrEqual(900);
    expect(delay).toBeLessThanOrEqual(1100);
  });

  it('increases with attempt number', () => {
    const d1 = calculateBackoffDelay(1, {
      baseDelayMs: 100,
      backoffMultiplier: 2,
      maxDelayMs: 100000,
    });
    const d3 = calculateBackoffDelay(3, {
      baseDelayMs: 100,
      backoffMultiplier: 2,
      maxDelayMs: 100000,
    });
    // attempt 3 base: 100 * 4 = 400, much greater than attempt 1 base: 100
    expect(d3).toBeGreaterThan(d1);
  });

  it('caps at maxDelayMs', () => {
    const delay = calculateBackoffDelay(100, {
      baseDelayMs: 1000,
      backoffMultiplier: 2,
      maxDelayMs: 5000,
    });
    expect(delay).toBeLessThanOrEqual(5000);
  });

  it('uses default options', () => {
    const delay = calculateBackoffDelay(1);
    expect(delay).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// sleep
// ---------------------------------------------------------------------------

describe('sleep', () => {
  it('resolves after specified ms', async () => {
    vi.useFakeTimers();
    const promise = sleep(100);
    vi.advanceTimersByTime(100);
    await promise;
    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// withRetry
// ---------------------------------------------------------------------------

describe('withRetry', () => {
  it('returns result on first success', async () => {
    const op = vi.fn().mockResolvedValue('ok');
    const result = await withRetry(op, {
      maxAttempts: 3,
      baseDelayMs: 1,
      maxDelayMs: 5,
      backoffMultiplier: 1,
    });
    expect(result).toBe('ok');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds', async () => {
    let calls = 0;
    const op = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls < 3) throw new Error(`fail ${calls}`);
      return 'success';
    });

    const result = await withRetry(op, {
      maxAttempts: 3,
      baseDelayMs: 1,
      maxDelayMs: 5,
      backoffMultiplier: 1,
    });
    expect(result).toBe('success');
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('throws last error after all attempts exhausted', async () => {
    const op = vi.fn().mockRejectedValue(new Error('always fails'));

    await expect(
      withRetry(op, { maxAttempts: 2, baseDelayMs: 1, maxDelayMs: 5, backoffMultiplier: 1 })
    ).rejects.toThrow('always fails');
    expect(op).toHaveBeenCalledTimes(2);
  });

  it('wraps non-Error throws in Error', async () => {
    const op = vi.fn().mockRejectedValue('string error');

    await expect(
      withRetry(op, { maxAttempts: 1, baseDelayMs: 1, maxDelayMs: 5, backoffMultiplier: 1 })
    ).rejects.toThrow('string error');
  });
});

// ---------------------------------------------------------------------------
// Validation Helpers
// ---------------------------------------------------------------------------

describe('isValidUUID', () => {
  it('returns true for valid UUID v4', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('returns false for invalid UUID', () => {
    expect(isValidUUID('not-a-uuid')).toBe(false);
    expect(isValidUUID('')).toBe(false);
    expect(isValidUUID('550e8400-e29b-31d4-a716-446655440000')).toBe(false); // version 3
  });

  it('is case insensitive', () => {
    expect(isValidUUID('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
  });
});

describe('isValidISODate', () => {
  it('returns true for valid ISO date', () => {
    expect(isValidISODate('2025-01-22T00:00:00.000Z')).toBe(true);
  });

  it('returns false for invalid dates', () => {
    expect(isValidISODate('not-a-date')).toBe(false);
    expect(isValidISODate('')).toBe(false);
    expect(isValidISODate('2025-01-22')).toBe(false); // not full ISO
  });
});

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles min equals max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });

  it('handles boundary values', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
