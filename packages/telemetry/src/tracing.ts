/**
 * Distributed tracing primitives with W3C Trace Context propagation.
 *
 * Provides a pure-JS tracer that works without OTel installed,
 * plus an OpenTelemetry bridge when available.
 */

export interface SpanContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string | undefined;
  sampled?: boolean;
}

export interface Span {
  readonly context: SpanContext;
  setAttribute(key: string, value: string | number | boolean): void;
  setAttributes(attrs: Record<string, string | number | boolean>): void;
  recordException(error: unknown): void;
  end(): void;
}

export interface Tracer {
  startSpan(name: string, options?: { parent?: SpanContext }): Span;
  withSpan<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    options?: { parent?: SpanContext }
  ): Promise<T>;
}

// ---------------------------------------------------------------------------
// W3C Trace Context (traceparent / tracestate)
// ---------------------------------------------------------------------------

const TRACEPARENT_VERSION = '00';
const TRACE_FLAGS_SAMPLED = 0x01;

function generateTraceId(): string {
  return generateHex(32);
}

function generateSpanId(): string {
  return generateHex(16);
}

function generateHex(len: number): string {
  const buf = new Uint8Array(len / 2);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < buf.length; i++) {
      // eslint-disable-next-line no-restricted-properties
      buf[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function createSpanContext(parent?: SpanContext): SpanContext {
  return {
    traceId: parent?.traceId ?? generateTraceId(),
    spanId: generateSpanId(),
    parentSpanId: parent?.spanId,
    sampled: parent?.sampled ?? true,
  };
}

export function injectTraceContext(
  headers: Record<string, string>,
  spanContext: SpanContext
): void {
  const flags = (spanContext.sampled ? TRACE_FLAGS_SAMPLED : 0).toString(16).padStart(2, '0');
  headers['traceparent'] =
    `${TRACEPARENT_VERSION}-${spanContext.traceId}-${spanContext.spanId}-${flags}`;
}

export function extractTraceContext(headers: Record<string, string>): SpanContext | undefined {
  const tp = headers['traceparent'] ?? headers['Traceparent'];
  if (!tp) return undefined;

  const parts = tp.split('-');
  if (parts.length !== 4) return undefined;

  const [, traceId, spanId, flags] = parts;
  if (!traceId || !spanId || !flags) return undefined;
  if (!/^[0-9a-f]{32}$/i.test(traceId)) return undefined;
  if (!/^[0-9a-f]{16}$/i.test(spanId)) return undefined;

  return {
    traceId: traceId.toLowerCase(),
    spanId: spanId.toLowerCase(),
    sampled: (parseInt(flags, 16) & TRACE_FLAGS_SAMPLED) !== 0,
  };
}

// ---------------------------------------------------------------------------
// NoopTracer — for testing and when tracing is disabled
// ---------------------------------------------------------------------------

class NoopSpan implements Span {
  context: SpanContext;

  constructor(ctx: SpanContext) {
    this.context = ctx;
  }

  setAttribute(): void {}
  setAttributes(): void {}
  recordException(): void {}
  end(): void {}
}

export function createNoopTracer(): Tracer {
  return {
    startSpan(name, options) {
      return new NoopSpan(createSpanContext(options?.parent));
    },
    async withSpan(name, fn, options) {
      const span = new NoopSpan(createSpanContext(options?.parent));
      try {
        return await fn(span);
      } finally {
        span.end();
      }
    },
  };
}

// ---------------------------------------------------------------------------
// OtelTracer — bridges to @opentelemetry/api when available
// ---------------------------------------------------------------------------

export function createOtelTracer(): Tracer {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const otel = require('@opentelemetry/api');
    const otelTracer = otel.trace.getTracer('gtcx');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toSpanContext = (ctx: any, parentSpanId?: string): SpanContext => ({
      traceId: ctx.traceId as string,
      spanId: ctx.spanId as string,
      parentSpanId,
      sampled: ((ctx.traceFlags as number) & TRACE_FLAGS_SAMPLED) !== 0,
    });

    return {
      startSpan(name, options) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const otelSpan: any = otelTracer.startSpan(name, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parent: options?.parent as any,
        });
        return {
          get context() {
            return toSpanContext(otelSpan.spanContext(), options?.parent?.spanId);
          },
          setAttribute(key, value) {
            otelSpan.setAttribute(key, value);
          },
          setAttributes(attrs) {
            otelSpan.setAttributes(attrs);
          },
          recordException(error) {
            otelSpan.recordException(error as Error);
          },
          end() {
            otelSpan.end();
          },
        };
      },
      async withSpan(name, fn, options) {
        return await otelTracer.startActiveSpan(name, async (span: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const s = span as any;
          const wrapped: Span = {
            get context() {
              return toSpanContext(s.spanContext(), options?.parent?.spanId);
            },
            setAttribute(key, value) {
              s.setAttribute(key, value);
            },
            setAttributes(attrs) {
              s.setAttributes(attrs);
            },
            recordException(error) {
              s.recordException(error as Error);
            },
            end() {
              s.end();
            },
          };
          try {
            return await fn(wrapped);
          } catch (error) {
            s.recordException(error as Error);
            s.setStatus({ code: otel.SpanStatusCode?.ERROR ?? 2 });
            throw error;
          } finally {
            s.end();
          }
        });
      },
    };
  } catch {
    // OTel not available — fall back to noop
    return createNoopTracer();
  }
}
