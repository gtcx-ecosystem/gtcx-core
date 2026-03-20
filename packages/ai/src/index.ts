/**
 * @gtcx/ai - AI Integration Utilities
 *
 * Provides traced operation wrappers and category logging
 * for AI-native observability across GTCX packages.
 *
 * Stub implementation - full version lives in gtcx-intelligence.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface OperationLog<TInput = any, TOutput = any> {
  operationName: string;
  type: string;
  category?: string;
  input?: TInput;
  output?: TOutput;
  duration?: number;
  durationMs?: number | null;
  timestamp: number;
  success?: boolean;
  error?: { name: string; message: string; stack?: string };
  metadata?: Record<string, unknown>;
}

export interface TracedOptions {
  category?: string;
  logInput?: boolean;
  logOutput?: boolean;
  metadata?: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sanitizeInput?: (input: any) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sanitizeOutput?: (output: any) => unknown;
}

/**
 * Wrap a function with tracing (no-op stub - returns the function as-is)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function traced<T extends (...args: any[]) => any>(
  fn: T,
  _operationName: string,
  _options?: TracedOptions
): T {
  return fn;
}

/**
 * Higher-order tracing decorator (no-op stub)
 *
 * Supports two calling patterns:
 * 1. withTrace(fn, name, options) - wraps fn
 * 2. withTrace(fn) - executes fn and returns result
 */
export function withTrace<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (() => T) | ((...args: any[]) => any),
  _operationName?: string,
  _options?: TracedOptions
): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (fn as any)();
}

export interface CategoryLogger {
  info(message: string, data?: Record<string, unknown>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, ...args: any[]): void;
  debug(message: string, data?: Record<string, unknown>): void;
}

/**
 * Create a category-scoped logger that outputs structured JSON to stderr.
 */
export function createCategoryLogger(category: string): CategoryLogger {
  const emit = (level: string, message: string, data?: Record<string, unknown>) => {
    const entry = { level, category, msg: message, ...data, ts: new Date().toISOString() };
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(entry));
  };
  return {
    info: (msg, data) => emit('info', msg, data),
    warn: (msg, data) => emit('warn', msg, data),
    error: (msg, ...args) => emit('error', msg, args.length ? { args } : undefined),
    debug: (msg, data) => emit('debug', msg, data),
  };
}
