import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';

import {
  sleep,
  generateId,
  safeJsonParse,
  isDefined,
  omit,
  pick,
  deepClone,
  debounce,
  throttle,
  retry,
} from '../src';

// ============================================================================
// sleep
// ============================================================================

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve after the specified delay', async () => {
    let resolved = false;
    const promise = sleep(1000).then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(resolved).toBe(true);
  });
});

// ============================================================================
// generateId
// ============================================================================

describe('generateId', () => {
  it('should return a string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should include prefix when provided', () => {
    const id = generateId('user');
    expect(id.startsWith('user_')).toBe(true);
  });

  it('should generate unique IDs (100 generated, all unique)', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });
});

// ============================================================================
// safeJsonParse
// ============================================================================

describe('safeJsonParse', () => {
  it('should parse valid JSON', () => {
    const result = safeJsonParse('{"name":"Alice","age":30}', {});
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('should return fallback for invalid JSON', () => {
    const fallback = { error: true };
    const result = safeJsonParse('not valid json', fallback);
    expect(result).toBe(fallback);
  });

  it('should validate with Zod schema when provided', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    const result = safeJsonParse('{"name":"Bob","age":25}', { name: '', age: 0 }, schema);
    expect(result).toEqual({ name: 'Bob', age: 25 });
  });

  it('should return fallback when Zod schema validation fails', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    const fallback = { name: 'default', age: 0 };
    // age is a string, not a number — should fail validation
    const result = safeJsonParse('{"name":"Bob","age":"not-a-number"}', fallback, schema);
    expect(result).toBe(fallback);
  });

  it('should return fallback when JSON is invalid even with schema', () => {
    const schema = z.object({ name: z.string() });
    const fallback = { name: 'default' };
    const result = safeJsonParse('not json at all', fallback, schema);
    expect(result).toBe(fallback);
  });

  it('should work without schema (backwards compatible)', () => {
    const result = safeJsonParse('42', 0);
    expect(result).toBe(42);
  });
});

// ============================================================================
// isDefined
// ============================================================================

describe('isDefined', () => {
  it('should return true for defined values', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(false)).toBe(true);
    expect(isDefined([])).toBe(true);
  });

  it('should return false for null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });
});

// ============================================================================
// omit
// ============================================================================

describe('omit', () => {
  it('should remove specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 } as Record<string, unknown>;
    const result = omit(obj, ['b']);
    expect(result).toEqual({ a: 1, c: 3 });
    expect('b' in result).toBe(false);
  });

  it('should not modify the original object', () => {
    const obj = { a: 1, b: 2, c: 3 } as Record<string, unknown>;
    omit(obj, ['b']);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });
});

// ============================================================================
// pick
// ============================================================================

describe('pick', () => {
  it('should select specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 } as Record<string, unknown>;
    const result = pick(obj, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should ignore missing keys gracefully', () => {
    const obj = { a: 1, b: 2 } as Record<string, unknown>;
    const result = pick(obj, ['a', 'z']);
    expect(result).toEqual({ a: 1 });
    expect('z' in result).toBe(false);
  });
});

// ============================================================================
// deepClone
// ============================================================================

describe('deepClone', () => {
  it('should create an independent copy', () => {
    const original = { x: 1, y: 2 };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  it('should make nested objects independent', () => {
    const original = { outer: { inner: 42 } };
    const cloned = deepClone(original);

    cloned.outer.inner = 999;
    expect(original.outer.inner).toBe(42);
  });

  it('should preserve Date instances', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const original = { createdAt: date };
    const cloned = deepClone(original);

    expect(cloned.createdAt).toBeInstanceOf(Date);
    expect(cloned.createdAt.getTime()).toBe(date.getTime());
    expect(cloned.createdAt).not.toBe(date);
  });

  it('should preserve Map instances', () => {
    const original = new Map<string, number>([
      ['a', 1],
      ['b', 2],
    ]);
    const cloned = deepClone(original);

    expect(cloned).toBeInstanceOf(Map);
    expect(cloned.get('a')).toBe(1);
    expect(cloned.get('b')).toBe(2);
    expect(cloned).not.toBe(original);
  });

  it('should preserve Set instances', () => {
    const original = new Set([1, 2, 3]);
    const cloned = deepClone(original);

    expect(cloned).toBeInstanceOf(Set);
    expect(cloned.has(1)).toBe(true);
    expect(cloned.has(3)).toBe(true);
    expect(cloned).not.toBe(original);
  });

  it('should preserve RegExp instances', () => {
    const original = { pattern: /^test$/gi };
    const cloned = deepClone(original);

    expect(cloned.pattern).toBeInstanceOf(RegExp);
    expect(cloned.pattern.source).toBe('^test$');
    expect(cloned.pattern.flags).toBe('gi');
    expect(cloned.pattern).not.toBe(original.pattern);
  });

  it('should handle arrays', () => {
    const original = [1, [2, 3], { a: 4 }];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[1]).not.toBe(original[1]);
  });
});

// ============================================================================
// debounce
// ============================================================================

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should only call the function after the delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer on re-call within the delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    vi.advanceTimersByTime(100);
    debounced(); // Reset timer
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled(); // Still hasn't fired

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// throttle
// ============================================================================

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call the function immediately on first invocation', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should block subsequent calls within the limit', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

// ============================================================================
// retry
// ============================================================================

describe('retry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should succeed on the first try', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await retry(fn, { maxAttempts: 3, initialDelay: 100 });

    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success');

    const promise = retry(fn, { maxAttempts: 3, initialDelay: 100 });

    // First attempt fails, waits 100ms
    await vi.advanceTimersByTimeAsync(100);
    // Second attempt fails, waits 200ms (100 * 2)
    await vi.advanceTimersByTimeAsync(200);

    const result = await promise;
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw after maxAttempts is exhausted', async () => {
    vi.useRealTimers();
    const fn = vi.fn().mockImplementation(() => Promise.reject(new Error('always fails')));

    await expect(retry(fn, { maxAttempts: 3, initialDelay: 1 })).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(3);
    vi.useFakeTimers();
  });

  it('should apply exponential backoff', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('done');

    const promise = retry(fn, {
      maxAttempts: 3,
      initialDelay: 100,
      backoffMultiplier: 2,
    });

    // After first failure: delay = 100ms
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(100);
    expect(fn).toHaveBeenCalledTimes(2);

    // After second failure: delay = 200ms (100 * 2)
    await vi.advanceTimersByTimeAsync(200);
    expect(fn).toHaveBeenCalledTimes(3);

    const result = await promise;
    expect(result).toBe('done');
  });
});
