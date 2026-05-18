# @gtcx/resilience

Resilience primitives for service-to-service communication: circuit breaker, adaptive retry with jitter, timeout wrapper, and bulkhead (concurrency limiter).

## Installation

```bash
pnpm add @gtcx/resilience
```

## Quick Start

```typescript
import { createCircuitBreaker, withRetry, withTimeout, createBulkhead } from '@gtcx/resilience';

// Circuit breaker
const cb = createCircuitBreaker({ failureThreshold: 5, recoveryTimeout: 30000 });
const result = await cb.execute(() => fetch('/api/data'));

// Adaptive retry with jitter
const data = await withRetry(() => fetch('/api/data'), {
  maxAttempts: 3,
  strategy: 'exponential',
  jitter: 'full',
});

// Timeout wrapper
const response = await withTimeout(() => fetch('/api/data'), { ms: 5000 });

// Bulkhead (concurrency limiter)
const bulkhead = createBulkhead({ maxConcurrent: 10, maxQueue: 50 });
const result = await bulkhead.execute(() => heavyOperation());
```

## API

| Export                   | Description                              |
| ------------------------ | ---------------------------------------- |
| `createCircuitBreaker()` | Circuit breaker factory                  |
| `CircuitBreakerError`    | Error thrown when circuit is open        |
| `withRetry()`            | Retry wrapper with configurable policy   |
| `calculateDelay()`       | Compute retry delay for a given attempt  |
| `isRetryableError()`     | Check if an error is retryable           |
| `withTimeout()`          | Timeout wrapper                          |
| `TimeoutError`           | Error thrown on timeout                  |
| `createBulkhead()`       | Bulkhead (concurrency limiter) factory   |
| `BulkheadRejectedError`  | Error thrown when bulkhead queue is full |

## License

MIT
