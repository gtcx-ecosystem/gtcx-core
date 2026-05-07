/**
 * @gtcx/ai - AI Integration Utilities
 *
 * Provides traced operation wrappers and category logging
 * for AI-native observability across GTCX packages.
 *
 * Stub implementation - full version lives in gtcx-intelligence.
 */

export interface OperationLog<TInput = unknown, TOutput = unknown> {
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
  sanitizeInput?: (input: unknown) => unknown;
  sanitizeOutput?: (output: unknown) => unknown;
}

/**
 * Wrap a function with tracing (no-op stub - returns the function as-is)
 */
export function traced<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  _operationName: string,
  _options?: TracedOptions
): (...args: TArgs) => TReturn {
  return fn;
}

/**
 * Higher-order tracing decorator (no-op stub)
 *
 * Executes a no-argument function and returns its result.
 */
export function withTrace<T>(fn: () => T, _operationName?: string, _options?: TracedOptions): T {
  return fn();
}

export interface CategoryLogger {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
  debug(message: string, data?: Record<string, unknown>): void;
}

/**
 * Create a category-scoped logger that outputs structured JSON to stderr.
 */
export function createCategoryLogger(category: string): CategoryLogger {
  const emit = (level: string, message: string, data?: Record<string, unknown>) => {
    const entry = JSON.stringify({
      level,
      category,
      msg: message,
      ...data,
      ts: new Date().toISOString(),
    });

    process.stderr.write(entry + '\n');
  };
  return {
    info: (msg, data) => emit('info', msg, data),
    warn: (msg, data) => emit('warn', msg, data),
    error: (msg, data) => emit('error', msg, data),
    debug: (msg, data) => emit('debug', msg, data),
  };
}
