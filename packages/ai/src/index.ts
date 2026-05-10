/**
 * @gtcx/ai - AI Integration & Observability Utilities
 *
 * Provides traced operation wrappers and structured category logging
 * for observability across GTCX packages.
 *
 * All tracing is written to stderr as structured JSON lines.
 * No external dependencies — safe to use in any package.
 *
 * The package is decomposed into focused modules:
 * - `trace-context` — TraceContext type, AsyncLocalStorage propagation
 * - `category-logger` — structured per-category JSON logger
 * - `redaction` — default secret redaction (defense-in-depth)
 * - `span-emitter` — pluggable lifecycle emitter for OTel/Datadog/etc.
 * - `traced` — the load-bearing observability wrapper
 * - `provenance` — provenance-aware tracing extensions
 *
 * This file is a barrel re-export of every public symbol.
 */

// Trace context
export {
  type TraceContext,
  generateTraceId,
  generateSpanId,
  getCurrentTraceContext,
  runWithTraceContext,
} from './trace-context';

// Category logger
export { type CategoryLogger, createCategoryLogger } from './category-logger';

// Default secret redaction
export { redactSecrets } from './redaction';

// Span emitter contract
export {
  type SpanEmitter,
  type SpanLifecycleStart,
  type SpanLifecycleEnd,
  setDefaultSpanEmitter,
  getDefaultSpanEmitter,
} from './span-emitter';

// Traced wrapper
export { type OperationLog, type TracedOptions, traced, withTrace } from './traced';

// Provenance-aware tracing
export {
  attachProvenance,
  createProvenanceLogger,
  type ProvenanceLogger,
  type ProvenancedResult,
} from './provenance';
