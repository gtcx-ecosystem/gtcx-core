/**
 * Circuit Breaker — prevents cascade failures by stopping requests to
 * a failing dependency until it recovers.
 *
 * State machine: closed → open → half-open → closed
 * - closed: requests pass through; failures counted
 * - open: requests rejected immediately; timer running
 * - half-open: limited probe requests allowed to test recovery
 */

export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerStats {
  failures: number;
  successes: number;
  lastFailure?: number;
  lastSuccess?: number;
  stateChanges: number;
}

export interface CircuitBreakerConfig {
  /** Name for identification in metrics/logs */
  name?: string;
  /** Number of consecutive failures before opening (default: 5) */
  failureThreshold?: number;
  /** Number of consecutive successes in half-open to close (default: 2) */
  successThreshold?: number;
  /** Milliseconds before attempting half-open (default: 30_000) */
  resetTimeoutMs?: number;
  /** Max probe calls in half-open state (default: 3) */
  halfOpenMaxCalls?: number;
}

export class CircuitBreakerError extends Error {
  readonly config: CircuitBreakerConfig;
  readonly stats: CircuitBreakerStats;

  constructor(message: string, config: CircuitBreakerConfig, stats: CircuitBreakerStats) {
    super(message);
    this.name = 'CircuitBreakerError';
    this.config = config;
    this.stats = stats;
  }
}

export interface CircuitBreaker {
  readonly state: CircuitBreakerState;
  readonly stats: CircuitBreakerStats;
  execute<T>(fn: () => Promise<T>): Promise<T>;
  recordSuccess(): void;
  recordFailure(): void;
  reset(): void;
  onStateChange(handler: (state: CircuitBreakerState) => void): () => void;
}

interface MutableStats extends CircuitBreakerStats {
  consecutiveSuccesses: number;
  halfOpenCalls: number;
}

export function createCircuitBreaker(config: CircuitBreakerConfig = {}): CircuitBreaker {
  const {
    name = 'circuit-breaker',
    failureThreshold = 5,
    successThreshold = 2,
    resetTimeoutMs = 30_000,
    halfOpenMaxCalls = 3,
  } = config;

  let state: CircuitBreakerState = 'closed';
  let resetTimer: ReturnType<typeof setTimeout> | null = null;
  const handlers = new Set<(state: CircuitBreakerState) => void>();

  const stats: MutableStats = {
    failures: 0,
    successes: 0,
    stateChanges: 0,
    consecutiveSuccesses: 0,
    halfOpenCalls: 0,
  };

  function emitStateChange(newState: CircuitBreakerState): void {
    if (newState === state) return;
    state = newState;
    stats.stateChanges++;
    for (const handler of handlers) {
      try {
        handler(newState);
      } catch {
        // Handler errors must not break the breaker
      }
    }
  }

  function scheduleReset(): void {
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      resetTimer = null;
      if (state === 'open') {
        stats.halfOpenCalls = 0;
        emitStateChange('half-open');
      }
    }, resetTimeoutMs);
  }

  function recordSuccess(): void {
    stats.successes++;
    stats.lastSuccess = Date.now();

    if (state === 'half-open') {
      stats.consecutiveSuccesses++;
      if (stats.consecutiveSuccesses >= successThreshold) {
        stats.consecutiveSuccesses = 0;
        stats.halfOpenCalls = 0;
        emitStateChange('closed');
      }
    } else if (state === 'closed') {
      stats.consecutiveSuccesses++;
      if (stats.failures > 0 && stats.consecutiveSuccesses >= successThreshold) {
        stats.failures = 0;
      }
    }
  }

  function recordFailure(): void {
    stats.failures++;
    stats.lastFailure = Date.now();
    stats.consecutiveSuccesses = 0;

    if (state === 'half-open') {
      emitStateChange('open');
      scheduleReset();
      return;
    }

    if (state === 'closed' && stats.failures >= failureThreshold) {
      emitStateChange('open');
      scheduleReset();
    }
  }

  async function execute<T>(fn: () => Promise<T>): Promise<T> {
    if (state === 'open') {
      throw new CircuitBreakerError(`Circuit breaker "${name}" is OPEN`, config, { ...stats });
    }

    if (state === 'half-open') {
      if (stats.halfOpenCalls >= halfOpenMaxCalls) {
        throw new CircuitBreakerError(
          `Circuit breaker "${name}" is HALF-OPEN (max probes reached)`,
          config,
          { ...stats }
        );
      }
      stats.halfOpenCalls++;
    }

    try {
      const result = await fn();
      recordSuccess();
      return result;
    } catch (error) {
      recordFailure();
      throw error;
    }
  }

  function reset(): void {
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
    stats.failures = 0;
    stats.successes = 0;
    stats.consecutiveSuccesses = 0;
    stats.halfOpenCalls = 0;
    stats.stateChanges = 0;
    delete (stats as MutableStats & { lastFailure?: number }).lastFailure;
    delete (stats as MutableStats & { lastSuccess?: number }).lastSuccess;
    emitStateChange('closed');
  }

  function onStateChange(handler: (state: CircuitBreakerState) => void): () => void {
    handlers.add(handler);
    return () => {
      handlers.delete(handler);
    };
  }

  return {
    get state() {
      return state;
    },
    get stats() {
      return { ...stats };
    },
    execute,
    recordSuccess,
    recordFailure,
    reset,
    onStateChange,
  };
}
