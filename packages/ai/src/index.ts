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
  /**
   * Optional span emitter for forwarding traces to external systems
   * (OpenTelemetry, Honeycomb, custom backends). When set, overrides
   * the process-wide default registered via `setDefaultSpanEmitter`.
   *
   * Stderr JSON emission continues regardless — the emitter is additive.
   */
  spanEmitter?: SpanEmitter;
}

/**
 * Pluggable span lifecycle emitter for routing `traced()` operations to
 * external observability backends (OTel, Honeycomb, Datadog, etc.).
 *
 * Closes AI Trust Gap #4: previously `@gtcx/ai` emitted only structured
 * JSON to stderr, leaving OTel wiring as consumer-side aspirational work.
 * The SpanEmitter contract makes the integration explicit; bridge
 * implementations live in observability-specific packages (`@gtcx/telemetry`
 * for OTel) so `@gtcx/ai` itself remains zero-deps.
 *
 * Implementations MUST:
 * - Be safe to call from any context (sync, async, error paths)
 * - Not throw — emitter errors must not derail the traced operation
 * - Treat `onSpanStart` and `onSpanEnd` as paired: every start is followed
 *   by exactly one end (success or error). The matching key is `spanId`.
 */
export interface SpanEmitter {
  /** Called when a traced operation begins. */
  onSpanStart(span: SpanLifecycleStart): void;
  /** Called when a traced operation completes — success or failure. */
  onSpanEnd(span: SpanLifecycleEnd): void;
}

export interface SpanLifecycleStart {
  operationName: string;
  category: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string | undefined;
  startTimestamp: number;
  metadata?: Record<string, unknown> | undefined;
}

export interface SpanLifecycleEnd {
  operationName: string;
  category: string;
  traceId: string;
  spanId: string;
  durationMs: number;
  success: boolean;
  error?: { name: string; message: string } | undefined;
  metadata?: Record<string, unknown> | undefined;
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
// Default span emitter slot (process-wide)
// ---------------------------------------------------------------------------
//
// Higher-level packages (e.g. `@gtcx/telemetry`) register a default
// SpanEmitter at process startup so every `traced()` call automatically
// forwards span lifecycle events without per-call wiring. Per-call
// `options.spanEmitter` overrides the default.
//
// The slot is stored on globalThis so it survives module re-evaluation
// in test environments (vitest hot-reload, etc.).

const SPAN_EMITTER_KEY = '__gtcx_ai_default_span_emitter__';

function getDefaultEmitterSlot(): SpanEmitter | undefined {
  const g = globalThis as Record<string, unknown>;
  return g[SPAN_EMITTER_KEY] as SpanEmitter | undefined;
}

/**
 * Register a process-wide default {@link SpanEmitter}. Subsequent `traced()`
 * calls will forward span lifecycle events to this emitter unless overridden
 * per-call via `options.spanEmitter`. Pass `undefined` to clear.
 *
 * Typical wiring: `@gtcx/telemetry` calls this with an OTel-backed emitter
 * during runtime initialization, so consumers get OTel forwarding for free.
 */
export function setDefaultSpanEmitter(emitter: SpanEmitter | undefined): void {
  const g = globalThis as Record<string, unknown>;
  if (emitter === undefined) {
    delete g[SPAN_EMITTER_KEY];
  } else {
    g[SPAN_EMITTER_KEY] = emitter;
  }
}

/**
 * Read the current process-wide default {@link SpanEmitter}, or `undefined`
 * if none is registered. Primarily useful for diagnostics and tests.
 */
export function getDefaultSpanEmitter(): SpanEmitter | undefined {
  return getDefaultEmitterSlot();
}

/**
 * Invoke a SpanEmitter callback safely. Emitter exceptions must never
 * derail the traced operation — they are caught and surfaced via stderr
 * (level=warn) so the bug is visible without breaking the call.
 */
function safeEmit(fn: () => void, operationName: string, phase: 'start' | 'end'): void {
  try {
    fn();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    writeLog('warn', 'span_emitter_error', {
      event: 'span_emitter_error',
      operationName,
      phase,
      error: msg,
    });
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
// Default secret redaction (defense-in-depth)
// ---------------------------------------------------------------------------

/**
 * Keys whose values are automatically redacted when logged.
 * Applied as a default when `logInput` or `logOutput` is true
 * and no explicit sanitizer is provided — prevents accidental
 * leakage of cryptographic material through traced operations.
 */
const REDACTED_KEY_PATTERNS = [
  'privatekey',
  'private_key',
  'secret',
  'seed',
  'mnemonic',
  'password',
  'token',
  'apikey',
  'api_key',
  'randomness',
];

export function redactSecrets(value: unknown): unknown {
  if (value === null || value === undefined || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSecrets(item));
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (REDACTED_KEY_PATTERNS.some((p) => key.toLowerCase().includes(p))) {
      result[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      result[key] = redactSecrets(val);
    } else {
      result[key] = val;
    }
  }
  return result;
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

  // Emit a one-shot telemetry event when the caller provides an explicit
  // sanitizer that overrides the default `redactSecrets`. Closes AI Trust
  // Gap #3 from the audit: "Ambient redaction has an opt-out — a
  // misconfigured downstream consumer can ship `sanitizeInput: (x) => x`
  // and silently disable redaction."
  //
  // The event fires once per traced wrapper construction, not per call —
  // overrides are typically wired at module-init time, so logging once is
  // the right cardinality. Aggregators can grep `event=sanitizer_override`
  // to surface every active override at deployment time.
  const inputOverridden = options?.sanitizeInput !== undefined;
  const outputOverridden = options?.sanitizeOutput !== undefined;
  if (inputOverridden || outputOverridden) {
    writeLog('info', 'sanitizer_override', {
      event: 'sanitizer_override',
      category,
      operationName,
      overrides: { input: inputOverridden, output: outputOverridden },
    });
  }

  return (...args: TArgs): TReturn => {
    const ctx = buildTraceContext(options);
    const start = performance.now();
    const timestamp = Date.now();

    let input: unknown = args;
    const inputSanitizer =
      options?.sanitizeInput ?? (options?.logInput ? redactSecrets : undefined);
    if (inputSanitizer) {
      try {
        input = inputSanitizer(args);
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

    // Forward the span-start lifecycle event to the configured emitter
    // (per-call override, then process-wide default). Stderr emission
    // continues regardless — the emitter is additive. Errors in the
    // emitter surface via stderr but never derail the traced operation.
    const emitter = options?.spanEmitter ?? getDefaultEmitterSlot();
    if (emitter) {
      safeEmit(
        () =>
          emitter.onSpanStart({
            operationName,
            category,
            traceId: ctx.traceId,
            spanId: ctx.spanId,
            parentSpanId: ctx.parentSpanId,
            startTimestamp: timestamp,
            metadata: options?.metadata,
          }),
        operationName,
        'start'
      );
    }

    const complete = (result: TReturn): TReturn => {
      const durationMs = performance.now() - start;
      let output: unknown = result;
      const outputSanitizer =
        options?.sanitizeOutput ?? (options?.logOutput ? redactSecrets : undefined);
      if (outputSanitizer) {
        try {
          output = outputSanitizer(result);
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

      if (emitter) {
        safeEmit(
          () =>
            emitter.onSpanEnd({
              operationName,
              category,
              traceId: ctx.traceId,
              spanId: ctx.spanId,
              durationMs,
              success: true,
              metadata: options?.metadata,
            }),
          operationName,
          'end'
        );
      }
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

      if (emitter) {
        safeEmit(
          () =>
            emitter.onSpanEnd({
              operationName,
              category,
              traceId: ctx.traceId,
              spanId: ctx.spanId,
              durationMs,
              success: false,
              error: { name: error.name, message: error.message },
              metadata: options?.metadata,
            }),
          operationName,
          'end'
        );
      }
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
