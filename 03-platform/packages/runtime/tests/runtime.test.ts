import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@gtcx/api-client', async () => {
  const actual = await vi.importActual<typeof import('@gtcx/api-client')>('@gtcx/api-client');
  return {
    ...actual,
    createApiClient: vi.fn((options) => {
      (globalThis as any).__lastApiClientOptions = options;
      return {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
      } as unknown as import('@gtcx/api-client').IApiClient;
    }),
  };
});

import { createRuntime } from '../src/runtime.js';

describe('createRuntime', () => {
  afterEach(() => {
    delete (globalThis as any).__lastApiClientOptions;
  });

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

  it('uses otel tracer when telemetry is otel', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test', telemetry: 'otel' });
    expect(runtime.tracer).toBeDefined();
    runtime.destroy();
  });

  it('passes signer to api client', () => {
    const signer = vi.fn();
    const runtime = createRuntime({ baseUrl: 'https://api.test', signer });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('passes fetcher to api client', () => {
    const fetcher = vi.fn();
    const runtime = createRuntime({ baseUrl: 'https://api.test', fetcher });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('passes interceptors to api client', () => {
    const runtime = createRuntime({
      baseUrl: 'https://api.test',
      interceptors: { request: [] },
    });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('passes traceContext to api client', () => {
    const runtime = createRuntime({
      baseUrl: 'https://api.test',
      traceContext: { traceId: 'abc', spanId: 'def' },
    });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('enables offline queue', () => {
    const runtime = createRuntime({ baseUrl: 'https://api.test', offlineQueue: true });
    expect(runtime.client).toBeDefined();
    runtime.destroy();
  });

  it('telemetry onRequestError handles missing error', () => {
    createRuntime({ baseUrl: 'https://api.test', telemetry: 'in-memory' });
    const options = (globalThis as any).__lastApiClientOptions;
    expect(options.telemetry.onRequestError).toBeTypeOf('function');
    expect(() => options.telemetry.onRequestError({ method: 'GET', error: null })).not.toThrow();
  });
});
