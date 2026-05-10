/**
 * Trace context — span identifiers and AsyncLocalStorage propagation.
 *
 * The trace store is keyed on globalThis so it survives module
 * re-evaluation in test environments (vitest hot-reload, etc.).
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { randomBytes } from 'node:crypto';

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

export const traceStore = getGlobalTraceStore();

function generateId(length: number): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate a 32-char hex trace ID matching the W3C trace-context spec.
 */
export function generateTraceId(): string {
  return generateId(16);
}

/**
 * Generate a 16-char hex span ID matching the W3C trace-context spec.
 */
export function generateSpanId(): string {
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
