/**
 * @gtcx/telemetry — Coverage gap tests
 */

import { describe, it, expect, vi } from 'vitest';

import { PrometheusMetricsCollector } from '../src/metrics';
import { extractTraceContext } from '../src/tracing';

describe('tracing.ts — uncovered branches', () => {
  it('generateHex fallback when crypto.getRandomValues is missing', async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    Object.defineProperty(globalThis, 'crypto', {
      value: { getRandomValues: undefined },
      configurable: true,
      enumerable: true,
      writable: true,
    });
    try {
      vi.resetModules();
      const { createSpanContext } = await import('../src/tracing');
      const ctx = createSpanContext();
      expect(ctx.traceId).toMatch(/^[0-9a-f]{32}$/);
      expect(ctx.spanId).toMatch(/^[0-9a-f]{16}$/);
    } finally {
      if (original) {
        Object.defineProperty(globalThis, 'crypto', original);
      }
    }
  });

  it('extractTraceContext returns undefined when traceId is missing', () => {
    expect(extractTraceContext({ traceparent: '00--span-01' })).toBeUndefined();
  });

  it('extractTraceContext returns undefined when spanId is invalid', () => {
    const validTraceId = 'a'.repeat(32);
    expect(extractTraceContext({ traceparent: `00-${validTraceId}-bad-01` })).toBeUndefined();
  });

  it('createOtelTracer fallback when SpanStatusCode is missing', async () => {
    vi.doMock('@opentelemetry/api', () => ({
      trace: {
        getTracer: () => ({
          startSpan: () => ({
            spanContext: () => ({ traceId: 't', spanId: 's', traceFlags: 1 }),
            setAttribute: () => {},
            setAttributes: () => {},
            setStatus: () => {},
            recordException: () => {},
            end: () => {},
          }),
          startActiveSpan: (_name: string, fn: (span: unknown) => Promise<unknown>) =>
            fn({
              spanContext: () => ({ traceId: 't', spanId: 's', traceFlags: 1 }),
              setAttribute: () => {},
              setAttributes: () => {},
              setStatus: () => {},
              recordException: () => {},
              end: () => {},
            }),
        }),
      },
      // SpanStatusCode deliberately omitted to hit ?? fallback
    }));
    vi.resetModules();
    const { createOtelTracer } = await import('../src/tracing');
    const tracer = createOtelTracer();
    await expect(
      tracer.withSpan('test', async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');
  });
});

describe('metrics.ts — uncovered branches', () => {
  it('reuses prometheus counter with same key', () => {
    const mc = new PrometheusMetricsCollector();
    const c1 = mc.counter('hits', { zone: 'A' });
    c1.increment(3);
    const c2 = mc.counter('hits', { zone: 'A' });
    expect(c2.getValue()).toBe(3);
    expect(c1).toBe(c2);
  });

  it('renders histogram with labels in prometheus format', () => {
    const mc = new PrometheusMetricsCollector();
    const h = mc.histogram('latency_ms', [10, 100], { method: 'GET' });
    h.observe(5);
    h.observe(50);

    const text = mc.renderPrometheusText();
    expect(text).toContain('# TYPE latency_ms histogram');
    expect(text).toContain('latency_ms_bucket{method="GET",le="10") 1');
    expect(text).toContain('latency_ms_bucket{method="GET",le="100") 2');
    expect(text).toContain('latency_ms_bucket{method="GET",le="+Inf") 2');
    expect(text).toContain('latency_ms_sum{method="GET"} 55');
    expect(text).toContain('latency_ms_count{method="GET"} 2');
  });
});
