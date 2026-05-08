/**
 * @gtcx/ai - AI Integration & Observability Utilities
 *
 * Provides traced operation wrappers and structured category logging
 * for observability across GTCX packages.
 *
 * All tracing is written to stderr as structured JSON lines.
 * No external dependencies — safe to use in any package.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { randomBytes } from 'node:crypto';

// ---------------------------------------------------------------------------
// Trace Context
// ---------------------------------------------------------------------------

export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string | undefined;
}

const GLOBAL_KEY = '__gtcx_ai_trace_store__';

function getGlobalTraceStore(): AsyncLocalStorage<TraceContext> {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new AsyncLocalStorage<TraceContext>();
  }
  return g[GLOBAL_KEY] as AsyncLocalStorage<TraceContext>;
}

const traceStore = getGlobalTraceStore();

function generateId(length = 16): string {
  const bytes = randomBytes(length);
  return bytes.toString('hex');
}

function generateTraceId(): string {
  return generateId(16);
}

function generateSpanId(): string {
  return generateId(8);
}

/**
 * Get the current trace context from AsyncLocalStorage.
 * Returns `undefined` when not inside a traced operation.
 */
export function getCurrentTraceContext(): TraceContext | undefined {
  return traceStore.getStore();
}

/**
 * Run a function within an explicit trace context.
 * Useful for creating root spans or propagating external trace IDs.
 */
export function runWithTraceContext<T>(fn: () => T, context?: Partial<TraceContext>): T {
  const traceId = context?.traceId ?? generateTraceId();
  const spanId = context?.spanId ?? generateSpanId();
  const store: TraceContext = { traceId, spanId, parentSpanId: context?.parentSpanId };
  return traceStore.run(store, fn);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  traceId?: string;
  parentSpanId?: string;
}

export interface CategoryLogger {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
  debug(message: string, data?: Record<string, unknown>): void;
}

// ---------------------------------------------------------------------------
// INTERNAL: structured JSON stderr writer
// ---------------------------------------------------------------------------

function writeLog(level: string, message: string, data?: Record<string, unknown>): void {
  const entry = JSON.stringify({
    level,
    msg: message,
    ...data,
    ts: new Date().toISOString(),
  });
  if (typeof process !== 'undefined' && process.stderr) {
    process.stderr.write(entry + '\n');
  }
}

// ---------------------------------------------------------------------------
// Category Logger
// ---------------------------------------------------------------------------

/**
 * Create a category-scoped logger that outputs structured JSON to stderr.
 */
export function createCategoryLogger(category: string): CategoryLogger {
  const emit = (level: string, message: string, data?: Record<string, unknown>) => {
    writeLog(level, message, { category, ...data });
  };
  return {
    info: (msg, data) => emit('info', msg, data),
    warn: (msg, data) => emit('warn', msg, data),
    error: (msg, data) => emit('error', msg, data),
    debug: (msg, data) => emit('debug', msg, data),
  };
}

// ---------------------------------------------------------------------------
// traced — wrap any function with duration + structured logging
// ---------------------------------------------------------------------------

function buildTraceContext(options?: TracedOptions): TraceContext {
  const parent = traceStore.getStore();
  const traceId = options?.traceId ?? parent?.traceId ?? generateTraceId();
  const parentSpanId = options?.parentSpanId ?? parent?.spanId;
  const spanId = generateSpanId();
  return { traceId, spanId, parentSpanId };
}

function logWithContext(
  logger: CategoryLogger,
  level: 'info' | 'warn' | 'error' | 'debug',
  message: string,
  data: Record<string, unknown>,
  ctx: TraceContext
): void {
  const traceFields: Record<string, unknown> = {
    traceId: ctx.traceId,
    spanId: ctx.spanId,
  };
  if (ctx.parentSpanId) {
    traceFields['parentSpanId'] = ctx.parentSpanId;
  }
  logger[level](message, { ...traceFields, ...data });
}

/**
 * Wrap a function with tracing instrumentation.
 *
 * - Measures execution duration
 * - Logs operation start (debug) and completion (info)
 * - Logs errors (error level) with stack trace
 * - Respects `logInput` / `logOutput` / `sanitizeInput` / `sanitizeOutput`
 * - Propagates trace context across async boundaries via AsyncLocalStorage
 *
 * @example
 * const tracedSign = traced(sign, 'crypto.sign', {
 *   category: 'crypto',
 *   logInput: false, // never log private keys
 *   metadata: { algorithm: 'Ed25519' },
 * });
 */
export function traced<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  operationName: string,
  options?: TracedOptions
): (...args: TArgs) => TReturn {
  const category = options?.category ?? 'default';
  const logger = createCategoryLogger(category);

  return (...args: TArgs): TReturn => {
    const ctx = buildTraceContext(options);
    const start = performance.now();
    const timestamp = Date.now();

    let input: unknown = args;
    if (options?.sanitizeInput) {
      try {
        input = options.sanitizeInput(args);
      } catch {
        input = '[sanitize-error]';
      }
    }

    const startPayload: Record<string, unknown> = {
      operationName,
      timestamp,
      metadata: options?.metadata,
    };
    if (options?.logInput) {
      startPayload['input'] = input;
    }
    logWithContext(logger, 'debug', `[${operationName}] start`, startPayload, ctx);

    const complete = (result: TReturn): TReturn => {
      const durationMs = performance.now() - start;
      let output: unknown = result;
      if (options?.sanitizeOutput) {
        try {
          output = options.sanitizeOutput(result);
        } catch {
          output = '[sanitize-error]';
        }
      }
      const completePayload: Record<string, unknown> = {
        operationName,
        durationMs,
        success: true,
        metadata: options?.metadata,
      };
      if (options?.logOutput) {
        completePayload['output'] = output;
      }
      logWithContext(logger, 'info', `[${operationName}] complete`, completePayload, ctx);
      return result;
    };

    const fail = (reason: unknown): never => {
      const durationMs = performance.now() - start;
      const error = reason instanceof Error ? reason : new Error(String(reason));
      logWithContext(
        logger,
        'error',
        `[${operationName}] error`,
        {
          operationName,
          durationMs,
          success: false,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          metadata: options?.metadata,
        },
        ctx
      );
      throw reason;
    };

    const run = (): TReturn => {
      try {
        const result = fn(...args);

        // Handle promises (async functions)
        if (result instanceof Promise) {
          return result.then(
            (value) => complete(value),
            (reason: unknown) => fail(reason)
          ) as TReturn;
        }

        // Synchronous path
        return complete(result);
      } catch (reason: unknown) {
        return fail(reason);
      }
    };

    return traceStore.run(ctx, run);
  };
}

// ---------------------------------------------------------------------------
// withTrace — execute a no-arg function with tracing
// ---------------------------------------------------------------------------

/**
 * Execute a no-argument function with tracing instrumentation.
 *
 * @example
 * const result = withTrace(() => generateKeyPair(), 'crypto.keygen');
 */
export function withTrace<T>(fn: () => T, operationName?: string, options?: TracedOptions): T {
  const op = operationName ?? 'anonymous';
  return traced(fn, op, options)();
}

// ---------------------------------------------------------------------------
// Provenance-aware tracing
// ---------------------------------------------------------------------------

export {
  attachProvenance,
  createProvenanceLogger,
  type ProvenanceLogger,
  type ProvenancedResult,
} from './provenance';
