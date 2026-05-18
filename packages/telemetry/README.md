# @gtcx/telemetry

Unified OpenTelemetry-compatible instrumentation: metrics, traces, and logging bridges. Zero required external dependencies — OTel integration is optional via peer dependencies.

## Installation

```bash
pnpm add @gtcx/telemetry
```

## Quick Start

```typescript
import {
  createInMemoryMetricsCollector,
  createNoopTracer,
  createTelemetryLogger,
  runWithSpanContext,
} from '@gtcx/telemetry';

// Metrics
const metrics = createInMemoryMetricsCollector();
metrics.counter('requests').increment();

// Tracing
const tracer = createNoopTracer();
const span = tracer.startSpan('process-batch');
runWithSpanContext(span.context(), () => {
  // ... work happens in this span context
});

// Logging bridge
const logger = createTelemetryLogger('service');
logger.info('Batch processed', { count: 100 });
```

## API

| Export                             | Description                            |
| ---------------------------------- | -------------------------------------- |
| `createInMemoryMetricsCollector()` | In-memory metrics collector            |
| `PrometheusMetricsCollector`       | Prometheus-compatible metrics exporter |
| `createNoopTracer()`               | No-op tracer for zero-overhead default |
| `createOtelTracer()`               | OpenTelemetry tracer wrapper           |
| `createSpanContext()`              | Create a span context                  |
| `injectTraceContext()`             | Inject trace context into carriers     |
| `extractTraceContext()`            | Extract trace context from carriers    |
| `runWithSpanContext()`             | Run code within a span context         |
| `getCurrentSpanContext()`          | Get the current span context           |
| `createTelemetryLogger()`          | Create a telemetry-aware logger        |

## License

MIT
