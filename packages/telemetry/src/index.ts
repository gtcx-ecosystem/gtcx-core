/**
 * @gtcx/telemetry — Unified OpenTelemetry-compatible instrumentation
 *
 * Provides metrics, traces, and logging bridges with zero required
 * external dependencies. OTel integration is optional via peer deps.
 */

export {
  createInMemoryMetricsCollector,
  PrometheusMetricsCollector,
  type MetricsCollector,
  type Counter,
  type Gauge,
  type Histogram,
} from './metrics';

export {
  createNoopTracer,
  createOtelTracer,
  createSpanContext,
  injectTraceContext,
  extractTraceContext,
  type Span,
  type SpanContext,
  type Tracer,
} from './tracing';

export { runWithSpanContext, getCurrentSpanContext } from './context';

export { createTelemetryLogger, type TelemetryLogger } from './logging-bridge';
