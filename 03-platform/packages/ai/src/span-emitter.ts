/**
 * Pluggable span lifecycle emitter for routing `traced()` operations to
 * external observability backends (OpenTelemetry, Honeycomb, Datadog, etc.).
 *
 * Closes AI Trust Gap #4: previously `@gtcx/ai` emitted only structured
 * JSON to stderr, leaving OTel wiring as consumer-side aspirational work.
 * The SpanEmitter contract makes the integration explicit; bridge
 * implementations live in observability-specific packages
 * (`@gtcx/telemetry` for OTel) so `@gtcx/ai` itself remains zero-deps.
 */

import { writeLog } from './writer';

/**
 * Pluggable span lifecycle emitter.
 *
 * Implementations MUST:
 * - Be safe to call from any context (sync, async, error paths)
 * - Not throw — emitter errors must not derail the traced operation
 *   (the runner catches and surfaces them via stderr `event=span_emitter_error`)
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

// ---------------------------------------------------------------------------
// Process-wide default emitter slot
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

/**
 * Internal helper for `traced()` to read the slot. Not part of the
 * public API.
 */
export function getDefaultEmitterSlot(): SpanEmitter | undefined {
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
export function safeEmit(fn: () => void, operationName: string, phase: 'start' | 'end'): void {
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
