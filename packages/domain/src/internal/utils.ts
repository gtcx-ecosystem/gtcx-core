/**
 * Internal Utilities
 *
 * Private utilities for @gtcx/domain services.
 * NOT part of public API - do not import directly.
 *
 * @internal
 */

import crypto from 'crypto';

import { sleep } from '@gtcx/utils';

// Re-export sleep from @gtcx/utils (avoids duplication)
export { sleep };

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate unique ID with prefix.
 * Note: differs from @gtcx/utils generateId() — prefix is required here.
 * @internal
 */
export function generateId(prefix: string): string {
  const uuid = crypto.randomUUID();
  return `${prefix}_${uuid}`;
}

/**
 * Generate correlation ID for distributed tracing
 * @internal
 */
export function generateCorrelationId(): string {
  return generateId('corr');
}

/**
 * Generate idempotency key
 * @internal
 */
export function generateIdempotencyKey(operation: string, ...params: string[]): string {
  const hash = simpleHash([operation, ...params].join(':'));
  return `idem_${hash}_${Date.now()}`;
}

// ============================================================================
// HASHING
// ============================================================================

/**
 * Simple hash for non-cryptographic purposes
 * @internal
 */
export function simpleHash(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

// ============================================================================
// INPUT SANITIZATION
// ============================================================================

const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];
const PII_PATTERNS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
  /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, // SSN
  /\b(?:\d[ -]*?){13,19}\b/g, // Credit card (13-19 digits with optional separators)
  /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, // IPv4 address
];

/**
 * Sanitize object keys to prevent prototype pollution
 * @internal
 */
export function sanitizeKeys<T extends Record<string, unknown>>(
  obj: T,
  maxDepth = 20,
  _seen?: WeakSet<object>,
  _currentDepth = 0
): T {
  const seen = _seen ?? new WeakSet<object>();

  if (_currentDepth >= maxDepth) {
    return {} as T;
  }

  if (seen.has(obj)) {
    return {} as T; // Circular reference detected
  }
  seen.add(obj);

  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (DANGEROUS_KEYS.includes(key)) {
      continue; // Skip dangerous keys
    }

    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        sanitized[key as keyof T] = value.map((item) => {
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            return sanitizeKeys(item as Record<string, unknown>, maxDepth, seen, _currentDepth + 1);
          }
          if (Array.isArray(item)) {
            // Wrap array items in an object to recurse, then extract
            const wrapper = sanitizeKeys(
              { _arr: item } as Record<string, unknown>,
              maxDepth,
              seen,
              _currentDepth + 1
            );
            return (wrapper as Record<string, unknown>)['_arr'];
          }
          return item;
        }) as T[keyof T];
      } else {
        sanitized[key as keyof T] = sanitizeKeys(
          value as Record<string, unknown>,
          maxDepth,
          seen,
          _currentDepth + 1
        ) as T[keyof T];
      }
    } else {
      sanitized[key as keyof T] = value as T[keyof T];
    }
  }

  return sanitized;
}

/**
 * Redact PII from string
 * @internal
 */
export function redactPII(str: string): string {
  let result = str;
  for (const pattern of PII_PATTERNS) {
    pattern.lastIndex = 0; // Reset state for global regexes
    result = result.replace(pattern, '[REDACTED]');
  }
  return result;
}

/**
 * Sanitize object for logging (remove PII, truncate large values)
 * @internal
 */
export function sanitizeForLogging(
  obj: Record<string, unknown>,
  maxDepth = 3,
  currentDepth = 0
): Record<string, unknown> {
  if (currentDepth >= maxDepth) {
    return { _truncated: true };
  }

  const result: Record<string, unknown> = {};
  const piiKeys = [
    'name',
    'email',
    'phone',
    'address',
    'ssn',
    'passport',
    'license',
    'password',
    'secret',
    'token',
  ];

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    // Redact PII keys
    if (piiKeys.some((pii) => lowerKey.includes(pii))) {
      result[key] = '[REDACTED]';
      continue;
    }

    // Handle different value types
    if (value === null || value === undefined) {
      result[key] = value;
    } else if (typeof value === 'string') {
      const redacted = redactPII(value);
      result[key] = redacted.length > 200 ? `${redacted.substring(0, 200)}...` : redacted;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] =
        value.length > 10
          ? `[Array(${value.length})]`
          : value.map((v) =>
              typeof v === 'object'
                ? sanitizeForLogging(v as Record<string, unknown>, maxDepth, currentDepth + 1)
                : v
            );
    } else if (typeof value === 'object') {
      result[key] = sanitizeForLogging(
        value as Record<string, unknown>,
        maxDepth,
        currentDepth + 1
      );
    } else {
      result[key] = String(value);
    }
  }

  return result;
}

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory rate limiter
 * @internal
 */
export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private callsSinceCleanup = 0;
  private cleanupEveryNCalls: number;
  private cleanupTimer?: ReturnType<typeof setInterval>;

  constructor(
    maxRequests = 100,
    windowMs = 60000,
    options?: { cleanupIntervalMs?: number; cleanupEveryNCalls?: number }
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.cleanupEveryNCalls = options?.cleanupEveryNCalls ?? 100;

    if (options?.cleanupIntervalMs) {
      this.cleanupTimer = setInterval(() => this.cleanup(), options.cleanupIntervalMs);
      // Allow the process to exit without waiting for the timer
      if (
        this.cleanupTimer &&
        typeof this.cleanupTimer === 'object' &&
        'unref' in this.cleanupTimer
      ) {
        this.cleanupTimer.unref();
      }
    }
  }

  /**
   * Stop the periodic cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    this.callsSinceCleanup++;
    if (this.callsSinceCleanup >= this.cleanupEveryNCalls) {
      this.cleanup();
      this.callsSinceCleanup = 0;
    }

    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now >= entry.resetAt) {
      this.limits.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(key: string): number {
    const entry = this.limits.get(key);
    if (!entry || Date.now() >= entry.resetAt) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get reset time
   */
  getResetTime(key: string): number {
    const entry = this.limits.get(key);
    return entry?.resetAt ?? Date.now();
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetAt) {
        this.limits.delete(key);
      }
    }
  }
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

/**
 * Calculate delay for exponential backoff
 * @internal
 */
export function calculateBackoffDelay(
  attempt: number,
  options: Partial<RetryOptions> = {}
): number {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  const delay = opts.baseDelayMs * Math.pow(opts.backoffMultiplier, attempt - 1);
  // Add jitter (±10%)
  // eslint-disable-next-line no-restricted-properties -- Jitter for backoff; not security-sensitive
  const jitter = delay * 0.1 * (Math.random() * 2 - 1);
  return Math.min(delay + jitter, opts.maxDelayMs);
}

/**
 * Retry async operation with exponential backoff
 * @internal
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < opts.maxAttempts) {
        const delay = calculateBackoffDelay(attempt, opts);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Check if value is a valid UUID v4
 * @internal
 */
export function isValidUUID(value: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(value);
}

/**
 * Check if value is a valid ISO date string
 * @internal
 */
export function isValidISODate(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString();
}

/**
 * Clamp number to range
 * @internal
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
