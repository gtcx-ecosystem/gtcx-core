/**
 * @gtcx/security - Input Sanitization
 *
 * Utilities for sanitizing untrusted input before processing.
 * Implements P9 (Security by Design).
 */

import { ZodError, ZodSchema } from 'zod';

// =============================================================================
// STRING SANITIZATION
// =============================================================================

export interface StringSanitizeOptions {
  /** Maximum allowed length (truncates if exceeded) */
  maxLength?: number;
  /** Remove HTML tags */
  stripHtml?: boolean;
  /** Trim leading/trailing whitespace */
  trimWhitespace?: boolean;
  /** Normalize to NFC Unicode form */
  normalizeUnicode?: boolean;
  /** Replace control characters */
  stripControlChars?: boolean;
  /** Allowed characters regex (strips everything else) */
  allowedPattern?: RegExp;
}

const DEFAULT_STRING_OPTIONS: StringSanitizeOptions = {
  maxLength: 10000,
  stripHtml: true,
  trimWhitespace: true,
  normalizeUnicode: true,
  stripControlChars: true,
};

/**
 * Sanitize a string input
 */
export function sanitizeString(input: unknown, options: StringSanitizeOptions = {}): string {
  const opts = { ...DEFAULT_STRING_OPTIONS, ...options };

  // Convert to string
  let result = String(input ?? '');

  // Normalize Unicode
  if (opts.normalizeUnicode) {
    result = result.normalize('NFC');
  }

  // Strip control characters (keep newlines and tabs)
  if (opts.stripControlChars) {
    result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  // Strip HTML tags
  if (opts.stripHtml) {
    result = result.replace(/<[^>]*>/g, '');
  }

  // Trim whitespace
  if (opts.trimWhitespace) {
    result = result.trim();
  }

  // Apply allowed pattern
  if (opts.allowedPattern) {
    result = result
      .split('')
      .filter((c) => opts.allowedPattern!.test(c))
      .join('');
  }

  // Truncate to max length
  if (opts.maxLength && result.length > opts.maxLength) {
    result = result.substring(0, opts.maxLength);
  }

  return result;
}

// =============================================================================
// OBJECT SANITIZATION
// =============================================================================

export interface ObjectSanitizeOptions {
  /** Maximum nesting depth */
  maxDepth?: number;
  /** Maximum number of keys per object */
  maxKeys?: number;
  /** Maximum array length */
  maxArrayLength?: number;
  /** Remove __proto__ and constructor properties */
  stripProto?: boolean;
  /** Remove null and undefined values */
  stripNullish?: boolean;
  /** String sanitization options for string values */
  stringOptions?: StringSanitizeOptions;
}

const DEFAULT_OBJECT_OPTIONS: ObjectSanitizeOptions = {
  maxDepth: 10,
  maxKeys: 100,
  maxArrayLength: 1000,
  stripProto: true,
  stripNullish: false,
};

/**
 * Sanitize an object recursively
 */
export function sanitizeObject<T = unknown>(
  input: unknown,
  options: ObjectSanitizeOptions = {},
  currentDepth = 0
): T {
  const opts = { ...DEFAULT_OBJECT_OPTIONS, ...options };

  // Check depth limit
  if (currentDepth > (opts.maxDepth ?? 10)) {
    throw new SanitizationError('Maximum depth exceeded', 'MAX_DEPTH');
  }

  // Handle primitives
  if (input === null || input === undefined) {
    return (opts.stripNullish ? undefined : input) as T;
  }

  if (typeof input === 'string') {
    return sanitizeString(input, opts.stringOptions) as T;
  }

  if (typeof input === 'number' || typeof input === 'boolean') {
    return input as T;
  }

  // Handle arrays
  if (Array.isArray(input)) {
    const maxLen = opts.maxArrayLength ?? 1000;
    const truncated = input.slice(0, maxLen);
    return truncated
      .map((item) => sanitizeObject(item, opts, currentDepth + 1))
      .filter((item) => !opts.stripNullish || item !== undefined) as T;
  }

  // Handle objects
  if (typeof input === 'object') {
    const result: Record<string, unknown> = {};
    const keys = Object.keys(input as object);

    // Check key limit
    if (keys.length > (opts.maxKeys ?? 100)) {
      throw new SanitizationError('Maximum keys exceeded', 'MAX_KEYS');
    }

    for (const key of keys) {
      // Skip dangerous properties
      if (
        opts.stripProto &&
        (key === '__proto__' || key === 'constructor' || key === 'prototype')
      ) {
        continue;
      }

      const value = (input as Record<string, unknown>)[key];
      const sanitized = sanitizeObject(value, opts, currentDepth + 1);

      if (!opts.stripNullish || sanitized !== undefined) {
        result[key] = sanitized;
      }
    }

    return result as T;
  }

  // Reject functions and other types
  throw new SanitizationError(`Unsupported type: ${typeof input}`, 'UNSUPPORTED_TYPE');
}

// =============================================================================
// BOUNDARY VALIDATION
// =============================================================================

export interface ValidationResult<T> {
  success: true;
  data: T;
}

export interface ValidationError {
  success: false;
  error: {
    code: string;
    message: string;
    path?: (string | number)[] | undefined;
    details?: unknown | undefined;
  };
}

export type ValidationOutcome<T> = ValidationResult<T> | ValidationError;

/**
 * Create a boundary validator function
 *
 * Use at API boundaries, message handlers, and any external input point.
 *
 * @example
 * const validateRequest = createBoundaryValidator(RequestSchema);
 *
 * // In handler:
 * const result = validateRequest(rawInput);
 * if (!result.success) {
 *   return res.status(400).json(result.error);
 * }
 * const validData = result.data;
 */
export function createBoundaryValidator<T>(
  schema: ZodSchema<T>,
  options?: { sanitize?: boolean; sanitizeOptions?: ObjectSanitizeOptions }
): (input: unknown) => ValidationOutcome<T> {
  return (input: unknown): ValidationOutcome<T> => {
    try {
      // Optionally sanitize first
      const toValidate = options?.sanitize ? sanitizeObject(input, options.sanitizeOptions) : input;

      const data = schema.parse(toValidate);
      return { success: true, data };
    } catch (err) {
      if (err instanceof ZodError) {
        const firstError = err.errors[0];
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: firstError?.message ?? 'Validation failed',
            path: firstError?.path,
            details: err.errors,
          },
        };
      }

      if (err instanceof SanitizationError) {
        return {
          success: false,
          error: {
            code: err.code,
            message: err.message,
          },
        };
      }

      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred during validation',
        },
      };
    }
  };
}

/**
 * Strict boundary validator that throws on invalid input
 *
 * @throws {ValidationError} if validation fails
 */
export function createStrictValidator<T>(
  schema: ZodSchema<T>,
  options?: { sanitize?: boolean; sanitizeOptions?: ObjectSanitizeOptions }
): (input: unknown) => T {
  const validator = createBoundaryValidator(schema, options);

  return (input: unknown): T => {
    const result = validator(input);
    if (!result.success) {
      throw new BoundaryValidationError(result.error);
    }
    return result.data;
  };
}

// =============================================================================
// SPECIFIC SANITIZERS
// =============================================================================

/**
 * Sanitize for SQL (parameterized queries are still preferred!)
 */
export function sanitizeForSql(input: string): string {
  return input.replace(/'/g, "''").replace(/\\/g, '\\\\').replace(/\x00/g, '');
}

/**
 * Sanitize for URL path segment
 */
export function sanitizeForUrlPath(input: string): string {
  return encodeURIComponent(
    sanitizeString(input, {
      maxLength: 200,
      stripHtml: true,
      allowedPattern: /[a-zA-Z0-9\-_.]/,
    })
  );
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(input: string): string {
  return sanitizeString(input, {
    maxLength: 255,
    stripHtml: true,
    allowedPattern: /[a-zA-Z0-9\-_.]/,
  }).replace(/^\.+/, ''); // Remove leading dots
}

/**
 * Sanitize for logging (remove sensitive patterns)
 */
export function sanitizeForLog(input: string): string {
  return (
    input
      // Mask potential API keys
      .replace(/([a-zA-Z0-9_-]{20,})/g, (match) => {
        if (match.length > 30) {
          return `${match.substring(0, 8)}...${match.substring(match.length - 4)}`;
        }
        return match;
      })
      // Mask emails
      .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '***@$2')
      // Mask phone numbers
      .replace(/\+?[0-9]{10,}/g, '***PHONE***')
  );
}

// =============================================================================
// ERRORS
// =============================================================================

export class SanitizationError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'SanitizationError';
  }
}

export class BoundaryValidationError extends Error {
  constructor(public readonly validationError: ValidationError['error']) {
    super(validationError.message);
    this.name = 'BoundaryValidationError';
  }
}
