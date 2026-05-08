import { describe, it, expect } from 'vitest';

import { createCircuitBreaker, CircuitBreakerError } from '../src/circuit-breaker';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('createCircuitBreaker', () => {
  it('starts in closed state', () => {
    const cb = createCircuitBreaker();
    expect(cb.state).toBe('closed');
    expect(cb.stats.failures).toBe(0);
    expect(cb.stats.successes).toBe(0);
  });

  it('passes through successful calls in closed state', async () => {
    const cb = createCircuitBreaker();
    const result = await cb.execute(() => Promise.resolve(42));
    expect(result).toBe(42);
    expect(cb.stats.successes).toBe(1);
  });

  it('counts failures in closed state', async () => {
    const cb = createCircuitBreaker();
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    expect(cb.stats.failures).toBe(1);
  });

  it('opens after reaching failure threshold', async () => {
    const cb = createCircuitBreaker({ failureThreshold: 3 });

    for (let i = 0; i < 3; i++) {
      await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    }

    expect(cb.state).toBe('open');
    await expect(cb.execute(() => Promise.resolve(42))).rejects.toBeInstanceOf(CircuitBreakerError);
  });

  it('rejects immediately when open', async () => {
    const cb = createCircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 10_000 });
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();

    const start = Date.now();
    await expect(cb.execute(() => Promise.resolve(42))).rejects.toBeInstanceOf(CircuitBreakerError);
    expect(Date.now() - start).toBeLessThan(50); // Immediate rejection
  });

  it('transitions to half-open after reset timeout', async () => {
    const cb = createCircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 50 });
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();
    expect(cb.state).toBe('open');

    await wait(100);
    expect(cb.state).toBe('half-open');
  });

  it('closes after success threshold in half-open', async () => {
    const cb = createCircuitBreaker({
      failureThreshold: 1,
      successThreshold: 2,
      resetTimeoutMs: 50,
    });

    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();
    await wait(100);

    // First success in half-open
    await cb.execute(() => Promise.resolve(1));
    expect(cb.state).toBe('half-open');

    // Second success closes
    await cb.execute(() => Promise.resolve(2));
    expect(cb.state).toBe('closed');
  });

  it('re-opens on failure in half-open', async () => {
    const cb = createCircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 50 });
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();
    await wait(100);

    expect(cb.state).toBe('half-open');
    await expect(cb.execute(() => Promise.reject(new Error('fail2')))).rejects.toThrow('fail2');
    expect(cb.state).toBe('open');
  });

  it('limits half-open probe calls', async () => {
    const cb = createCircuitBreaker({
      failureThreshold: 1,
      resetTimeoutMs: 50,
      halfOpenMaxCalls: 2,
      successThreshold: 10, // Never close naturally
    });

    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();
    await wait(100);

    // First probe
    await cb.execute(() => Promise.resolve(1));
    // Second probe
    await cb.execute(() => Promise.resolve(2));
    // Third probe rejected
    await expect(cb.execute(() => Promise.resolve(3))).rejects.toBeInstanceOf(CircuitBreakerError);
  });

  it('emits state change events', async () => {
    const cb = createCircuitBreaker({
      failureThreshold: 1,
      successThreshold: 2,
      resetTimeoutMs: 50,
    });
    const states: string[] = [];
    const unsubscribe = cb.onStateChange((s) => states.push(s));

    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();
    await wait(100);
    await cb.execute(() => Promise.resolve(1));
    await cb.execute(() => Promise.resolve(2));

    expect(states).toContain('open');
    expect(states).toContain('half-open');
    expect(states).toContain('closed');

    unsubscribe();
  });

  it('resets to closed', async () => {
    const cb = createCircuitBreaker({ failureThreshold: 1 });
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();
    expect(cb.state).toBe('open');

    cb.reset();
    expect(cb.state).toBe('closed');
    expect(cb.stats.failures).toBe(0);
    // Reset from open → closed counts as a state change
    expect(cb.stats.stateChanges).toBe(1);
  });

  it('reports correct stats', async () => {
    const cb = createCircuitBreaker();
    await cb.execute(() => Promise.resolve(1));
    await cb.execute(() => Promise.resolve(2));
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();

    expect(cb.stats.successes).toBe(2);
    expect(cb.stats.failures).toBe(1);
    expect(cb.stats.lastFailure).toBeTypeOf('number');
    expect(cb.stats.lastSuccess).toBeTypeOf('number');
  });

  it('handler errors do not break the breaker', async () => {
    const cb = createCircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 50 });
    cb.onStateChange(() => {
      throw new Error('handler crash');
    });

    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    expect(cb.state).toBe('open');
  });
});
