/**
 * Runtime substrate factory.
 *
 * Wires together connectivity detection, adaptive API client,
 * resilience primitives, and telemetry into a single surface.
 */

import { createApiClient, type ApiClientOptions, type IApiClient } from '@gtcx/api-client';
import {
  ConnectivityDetector,
  createAdaptiveClientOptions,
  createOfflineHandlerFromDetector,
  type ConnectivityDetectorOptions,
} from '@gtcx/connectivity';
import { createLogger, type Logger } from '@gtcx/logging';
import {
  createCircuitBreaker,
  createBulkhead,
  type CircuitBreaker,
  type Bulkhead,
} from '@gtcx/resilience';
import {
  createNoopTracer,
  createOtelTracer,
  createInMemoryMetricsCollector,
  PrometheusMetricsCollector,
  type MetricsCollector,
  type SpanContext,
  type Tracer,
} from '@gtcx/telemetry';

/** Runtime deployment target. */
export type DeploymentProfile = 'edge' | 'satellite' | 'standard' | 'test';

/** Substrate configuration. */
export interface RuntimeOptions {
  /** Base URL for API requests. */
  baseUrl: string;
  /** Deployment profile — influences defaults. */
  deployment?: DeploymentProfile;
  /** Optional request signer. */
  signer?: ApiClientOptions['signer'];
  /** Custom fetcher (for testing or undici). */
  fetcher?: ApiClientOptions['fetcher'];
  /** Connectivity detector options. */
  connectivity?: ConnectivityDetectorOptions;
  /** Enable connectivity-driven offline queueing. */
  offlineQueue?: boolean;
  /** Enable circuit breaker on the API client. */
  circuitBreaker?: boolean;
  /** Enable bulkhead (concurrency limiting) on the API client. */
  bulkhead?: boolean;
  /** Telemetry mode. */
  telemetry?: 'none' | 'in-memory' | 'prometheus' | 'otel';
  /** Service name for telemetry. */
  serviceName?: string;
  /** Initial trace context. */
  traceContext?: SpanContext | (() => SpanContext | undefined);
  /** Request/response interceptors. */
  interceptors?: ApiClientOptions['interceptors'];
  /** Custom logger; if omitted, a default logger is created. */
  logger?: Logger;
  /** Extra headers sent on every request. */
  headers?: Record<string, string>;
}

/** The runtime substrate surface. */
export interface Runtime {
  /** Pre-configured API client. */
  client: IApiClient;
  /** Connectivity detector. */
  connectivity: ConnectivityDetector;
  /** Circuit breaker (if enabled). */
  circuitBreaker?: CircuitBreaker | undefined;
  /** Bulkhead (if enabled). */
  bulkhead?: Bulkhead | undefined;
  /** Metrics collector. */
  metrics: MetricsCollector;
  /** Tracer. */
  tracer: Tracer;
  /** Logger. */
  logger: Logger;
  /** Clean up timers, listeners, and resources. */
  destroy(): void;
}

const DEPLOYMENT_OVERRIDES: Record<
  DeploymentProfile,
  Partial<ApiClientOptions & { telemetry: RuntimeOptions['telemetry'] }>
> = {
  edge: { timeout: 60_000, retries: 1, telemetry: 'in-memory' },
  satellite: { timeout: 120_000, retries: 5, telemetry: 'in-memory' },
  standard: { timeout: 30_000, retries: 3, telemetry: 'prometheus' },
  test: { timeout: 5_000, retries: 0, telemetry: 'none' },
};

/** Create a batteries-included runtime substrate. */
export function createRuntime(options: RuntimeOptions): Runtime {
  const deployment = options.deployment ?? 'standard';
  const overrides = DEPLOYMENT_OVERRIDES[deployment];

  const logger = options.logger ?? createLogger({ service: options.serviceName ?? 'gtcx-runtime' });

  // Connectivity
  const connectivity = new ConnectivityDetector(options.connectivity);

  // Telemetry
  const telemetryMode = options.telemetry ?? overrides.telemetry ?? 'none';
  const metrics: MetricsCollector =
    telemetryMode === 'prometheus'
      ? new PrometheusMetricsCollector()
      : createInMemoryMetricsCollector();

  const tracer: Tracer = telemetryMode === 'otel' ? createOtelTracer() : createNoopTracer();

  // Build API client options — avoid spreading undefined values under exactOptionalPropertyTypes
  const baseClientOptions: ApiClientOptions = { baseUrl: options.baseUrl };

  if (options.deployment) {
    if (overrides.timeout !== undefined) {
      baseClientOptions.timeout = overrides.timeout;
    }
    if (overrides.retries !== undefined) {
      baseClientOptions.retries = overrides.retries;
    }
  }
  if (options.headers !== undefined) {
    baseClientOptions.headers = options.headers;
  }
  if (options.signer !== undefined) {
    baseClientOptions.signer = options.signer;
  }
  if (options.fetcher !== undefined) {
    baseClientOptions.fetcher = options.fetcher;
  }
  if (options.interceptors !== undefined) {
    baseClientOptions.interceptors = options.interceptors;
  }
  if (options.traceContext !== undefined) {
    baseClientOptions.traceContext = options.traceContext;
  }

  baseClientOptions.telemetry = {
    onRequestStart(ctx) {
      metrics.counter('http_requests_total', { method: ctx.method }).increment();
      logger.debug('request start', ctx);
    },
    onRequestComplete(ctx) {
      metrics
        .counter('http_responses_total', { method: ctx.method, status: String(ctx.status) })
        .increment();
      metrics
        .histogram('http_request_duration_ms', [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000], {
          method: ctx.method,
        })
        .observe(ctx.durationMs);
      logger.debug('request complete', ctx);
    },
    onRequestError(ctx) {
      metrics
        .counter('http_errors_total', { method: ctx.method, retryable: String(ctx.retryable) })
        .increment();
      logger.warn('request error', {
        ...ctx,
        error: (ctx.error as Error)?.message ?? String(ctx.error),
      });
    },
  };

  if (options.offlineQueue) {
    baseClientOptions.offline = createOfflineHandlerFromDetector(connectivity);
  }

  // Adapt options to connectivity profile
  const adaptive = createAdaptiveClientOptions(connectivity, baseClientOptions);

  // Resilience primitives
  let circuitBreaker: CircuitBreaker | undefined;
  let bulkhead: Bulkhead | undefined;

  if (options.circuitBreaker) {
    circuitBreaker = createCircuitBreaker({
      failureThreshold: 5,
      resetTimeoutMs: 30_000,
    });
  }

  if (options.bulkhead) {
    bulkhead = createBulkhead({ maxConcurrent: 10, maxQueue: 50 });
  }

  // Create the API client with the adaptive options.
  const client = createApiClient(adaptive.options);

  // Start connectivity checks
  connectivity.start();

  return {
    client,
    connectivity,
    circuitBreaker,
    bulkhead,
    metrics,
    tracer,
    logger,
    destroy() {
      connectivity.destroy();
      adaptive.unsubscribe();
      circuitBreaker?.reset();
    },
  };
}
