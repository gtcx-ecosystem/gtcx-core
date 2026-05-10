/**
 * `traced()` — wrap any function with duration measurement, structured
 * logging, AsyncLocalStorage trace propagation, and pluggable span
 * forwarding.
 *
 * This is the load-bearing observability primitive of `@gtcx/ai`.
 * Stderr emission is always on; SpanEmitter forwarding is additive and
 * controlled per-call or via the process-wide default slot.
 */

import { type CategoryLogger, createCategoryLogger } from './category-logger';
import { redactSecrets } from './redaction';
import { type SpanEmitter, getDefaultEmitterSlot, safeEmit } from './span-emitter';
import { type TraceContext, generateSpanId, generateTraceId, traceStore } from './trace-context';
import { writeLog } from './writer';

// ---------------------------------------------------------------------------
// Public types
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

// ---------------------------------------------------------------------------
// Internal helpers
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

// ---------------------------------------------------------------------------
// traced
// ---------------------------------------------------------------------------

/**
 * Wrap a function with tracing instrumentation.
 *
 * - Measures execution duration
 * - Logs operation start (debug) and completion (info)
 * - Logs errors (error level) with stack trace
 * - Respects `logInput` / `logOutput` / `sanitizeInput` / `sanitizeOutput`
 * - Propagates trace context across async boundaries via AsyncLocalStorage
 * - Forwards span lifecycle events to the configured `SpanEmitter`
 *   (per-call or process-wide default)
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
  // Gap #3: "Ambient redaction has an opt-out — a misconfigured downstream
  // consumer can ship `sanitizeInput: (x) => x` and silently disable
  // redaction." Aggregators can grep `event=sanitizer_override` to surface
  // every active override at deployment time.
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
