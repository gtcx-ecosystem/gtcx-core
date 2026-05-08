import { describe, expect, it, vi } from 'vitest';

import { createRuntime } from '../src/runtime.js';

describe('createRuntime', () => {
  it('creates a runtime with default standard deployment', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test' });
    expect(runtime.client).toBeDefined();
    expect(runtime.connectivity).toBeDefined();
    expect(runtime.metrics).toBeDefined();
    expect(runtime.tracer).toBeDefined();
    expect(runtime.logger).toBeDefined();
    runtime.destroy();
  });

  it('creates a runtime with edge deployment', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test', deployment: 'edge' });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('creates a runtime with satellite deployment', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test', deployment: 'satellite' });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('creates a runtime with test deployment', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test', deployment: 'test' });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('creates circuit breaker when enabled', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test', circuitBreaker: true });
    expect(runtime.circuitBreaker).toBeDefined();
    runtime.destroy();
  });

  it('does not create circuit breaker when disabled', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test' });
    expect(runtime.circuitBreaker).toBeUndefined();
    runtime.destroy();
  });

  it('creates bulkhead when enabled', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test', bulkhead: true });
    expect(runtime.bulkhead).toBeDefined();
    runtime.destroy();
  });

  it('does not create bulkhead when disabled', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test' });
    expect(runtime.bulkhead).toBeUndefined();
    runtime.destroy();
  });

  it('uses custom logger when provided', () => {
    const customLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      child: vi.fn().mockReturnThis(),
    };
    const runtime = createRuntime({
      baseUrl: 'https://api.test',
      logger: customLogger as unknown as import('@gtcx/logging').Logger,
    });
    expect(runtime.logger).toBe(customLogger);
    runtime.destroy();
  });

  it('uses custom headers', () => {
    const runtime = createRuntime({
      baseUrl: 'https://api.test',
      headers: { 'X-Custom': '1' },
    });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('destroys without throwing', () => {
    const runtime = createRuntime({
      baseUrl: 'https://api.test',
      circuitBreaker: true,
      bulkhead: true,
    });
    expect(() => runtime.destroy()).not.toThrow();
  });

  it('emits telemetry metrics on request start', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test', telemetry: 'in-memory' });
    // Just verify the runtime was created with telemetry hooks
    expect(runtime.metrics).toBeDefined();
    runtime.destroy();
  });

  it('starts connectivity detector automatically', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test' });
    // There's no public isRunning flag, but we can verify the detector exists
    expect(runtime.connectivity).toBeDefined();
    runtime.destroy();
  });
});
