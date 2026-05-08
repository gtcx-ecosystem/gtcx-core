import { describe, it, expect } from 'vitest';

import {
  createNoopTracer,
  createSpanContext,
  injectTraceContext,
  extractTraceContext,
} from '../src/tracing';

describe('createSpanContext', () => {
  it('generates a root context', () => {
    const ctx = createSpanContext();
    expect(ctx.traceId).toMatch(/^[0-9a-f]{32}$/);
    expect(ctx.spanId).toMatch(/^[0-9a-f]{16}$/);
    expect(ctx.parentSpanId).toBeUndefined();
    expect(ctx.sampled).toBe(true);
  });

  it('inherits traceId from parent', () => {
    const parent = createSpanContext();
    const child = createSpanContext(parent);
    expect(child.traceId).toBe(parent.traceId);
    expect(child.parentSpanId).toBe(parent.spanId);
    expect(child.spanId).not.toBe(parent.spanId);
  });

  it('inherits sampled from parent', () => {
    const parent = createSpanContext();
    parent.sampled = false;
    const child = createSpanContext(parent);
    expect(child.sampled).toBe(false);
  });
});

describe('injectTraceContext / extractTraceContext', () => {
  it('round-trips traceparent header', () => {
    const ctx = createSpanContext();
    const headers: Record<string, string> = {};
    injectTraceContext(headers, ctx);

    expect(headers.traceparent).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);

    const extracted = extractTraceContext(headers);
    expect(extracted).toBeDefined();
    expect(extracted!.traceId).toBe(ctx.traceId);
    expect(extracted!.spanId).toBe(ctx.spanId);
    expect(extracted!.sampled).toBe(true);
  });

  it('extracts unsampled context', () => {
    const ctx = createSpanContext();
    ctx.sampled = false;
    const headers: Record<string, string> = {};
    injectTraceContext(headers, ctx);

    expect(headers.traceparent).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-00$/);

    const extracted = extractTraceContext(headers);
    expect(extracted!.sampled).toBe(false);
  });

  it('returns undefined for missing header', () => {
    expect(extractTraceContext({})).toBeUndefined();
  });

  it('returns undefined for malformed header', () => {
    expect(extractTraceContext({ traceparent: 'invalid' })).toBeUndefined();
    expect(extractTraceContext({ traceparent: '00-bad-bad-01' })).toBeUndefined();
  });

  it('handles capitalized header key', () => {
    const ctx = createSpanContext();
    const headers: Record<string, string> = {};
    injectTraceContext(headers, ctx);
    const extracted = extractTraceContext({ Traceparent: headers.traceparent });
    expect(extracted).toBeDefined();
  });
});

describe('NoopTracer', () => {
  it('starts spans', () => {
    const tracer = createNoopTracer();
    const span = tracer.startSpan('test');
    expect(span.context.traceId).toMatch(/^[0-9a-f]{32}$/);
    expect(span.context.spanId).toMatch(/^[0-9a-f]{16}$/);
  });

  it('runs withSpan', async () => {
    const tracer = createNoopTracer();
    const result = await tracer.withSpan('test', async (span) => {
      span.setAttribute('key', 'value');
      span.recordException(new Error('ignored'));
      return 42;
    });
    expect(result).toBe(42);
  });

  it('propagates errors from withSpan', async () => {
    const tracer = createNoopTracer();
    await expect(
      tracer.withSpan('test', async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');
  });
});
