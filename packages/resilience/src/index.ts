/**
 * @gtcx/resilience — Resilience primitives for service-to-service communication
 *
 * Provides circuit breaker, adaptive retry with jitter, timeout wrapper,
 * and bulkhead (concurrency limiter) patterns. Zero runtime dependencies.
 */

export {
  createCircuitBreaker,
  CircuitBreakerError,
  type CircuitBreaker,
  type CircuitBreakerConfig,
  type CircuitBreakerState,
  type CircuitBreakerStats,
} from './circuit-breaker';

export {
  withRetry,
  calculateDelay,
  isRetryableError,
  type RetryPolicy,
  type RetryStrategy,
  type JitterMode,
} from './retry';

export { withTimeout, TimeoutError, type TimeoutConfig } from './timeout';

export {
  createBulkhead,
  BulkheadRejectedError,
  type Bulkhead,
  type BulkheadConfig,
} from './bulkhead';
