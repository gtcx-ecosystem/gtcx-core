import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  traced,
  withTrace,
  createCategoryLogger,
  getCurrentTraceContext,
  runWithTraceContext,
  attachProvenance,
  createProvenanceLogger,
  redactSecrets,
  setDefaultSpanEmitter,
  getDefaultSpanEmitter,
  type SpanEmitter,
  type SpanLifecycleStart,
  type SpanLifecycleEnd,
} from '../src/index';

describe('@gtcx/ai', () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stderrSpy.mockRestore();
  });

  function getLastLog(): Record<string, unknown> | null {
    const calls = stderrSpy.mock.calls;
    if (calls.length === 0) return null;
    const last = calls[calls.length - 1]![0] as string;
    try {
      return JSON.parse(last);
    } catch {
      return null;
    }
  }

  // ── traced() ──

  describe('traced()', () => {
    it('returns a callable wrapper', () => {
      const fn = (x: number) => x * 2;
      const wrapped = traced(fn, 'multiply');
      expect(wrapped(5)).toBe(10);
    });

    it('logs operation completion on success', () => {
      const fn = (a: number, b: number) => a + b;
      const wrapped = traced(fn, 'add', { category: 'math' });
      wrapped(3, 4);

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('info');
      expect(log!.msg).toContain('add');
      expect(log!.category).toBe('math');
      expect(log!.success).toBe(true);
      expect(typeof log!.durationMs).toBe('number');
    });

    it('logs operation start at debug level', () => {
      const fn = (x: number) => x;
      const wrapped = traced(fn, 'identity', { category: 'test' });
      wrapped(42);

      const logs = stderrSpy.mock.calls.map((c) => {
        try {
          return JSON.parse(c[0] as string);
        } catch {
          return null;
        }
      });
      const startLog = logs.find((l) => l && l.msg && String(l.msg).includes('start'));
      expect(startLog).toBeDefined();
      expect(startLog.level).toBe('debug');
    });

    it('logs errors on thrown exceptions', () => {
      const fn = () => {
        throw new Error('boom');
      };
      const wrapped = traced(fn, 'boomOp', { category: 'test' });
      expect(() => wrapped()).toThrow('boom');

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('error');
      expect(log!.success).toBe(false);
      expect(log!.error).toBeDefined();
      expect((log!.error as Record<string, string>).message).toBe('boom');
    });

    it('logs errors on rejected promises', async () => {
      const fn = async () => {
        throw new Error('async-boom');
      };
      const wrapped = traced(fn, 'asyncBoom', { category: 'test' });
      await expect(wrapped()).rejects.toThrow('async-boom');

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('error');
      expect(log!.success).toBe(false);
    });

    it('logs async success correctly', async () => {
      const fn = async (x: number) => x * 3;
      const wrapped = traced(fn, 'asyncMultiply', { category: 'test' });
      const result = await wrapped(5);
      expect(result).toBe(15);

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('info');
      expect(log!.success).toBe(true);
    });

    it('includes metadata in logs', () => {
      const fn = () => 'ok';
      const wrapped = traced(fn, 'metaOp', {
        category: 'test',
        metadata: { env: 'test', version: '1.0' },
      });
      wrapped();

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.metadata).toEqual({ env: 'test', version: '1.0' });
    });

    it('logs input when logInput is true', () => {
      const fn = (x: number) => x;
      const wrapped = traced(fn, 'inputOp', {
        category: 'test',
        logInput: true,
      });
      wrapped(42);

      const logs = stderrSpy.mock.calls.map((c) => {
        try {
          return JSON.parse(c[0] as string);
        } catch {
          return null;
        }
      });
      const debugLog = logs.find((l) => l && String(l.msg).includes('start'));
      expect(debugLog).toBeDefined();
      expect(debugLog.input).toBeDefined();
    });

    it('logs output when logOutput is true', () => {
      const fn = () => ({ result: 'success' });
      const wrapped = traced(fn, 'outputOp', {
        category: 'test',
        logOutput: true,
      });
      wrapped();

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.output).toEqual({ result: 'success' });
    });

    it('applies sanitizeInput before logging', () => {
      const fn = (obj: { password: string }) => obj.password;
      const wrapped = traced(fn, 'sanitizeIn', {
        category: 'test',
        logInput: true,
        sanitizeInput: () => '[REDACTED]',
      });
      wrapped({ password: 'secret' });

      const logs = stderrSpy.mock.calls.map((c) => {
        try {
          return JSON.parse(c[0] as string);
        } catch {
          return null;
        }
      });
      const debugLog = logs.find((l) => l && String(l.msg).includes('start'));
      expect(debugLog).toBeDefined();
      expect(debugLog.input).toBe('[REDACTED]');
    });

    it('applies sanitizeOutput before logging', () => {
      const fn = () => ({ token: 'abc123' });
      const wrapped = traced(fn, 'sanitizeOut', {
        category: 'test',
        logOutput: true,
        sanitizeOutput: () => '[REDACTED]',
      });
      wrapped();

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.output).toBe('[REDACTED]');
    });

    it('handles sanitize errors gracefully', () => {
      const fn = () => 'result';
      const wrapped = traced(fn, 'badSanitize', {
        category: 'test',
        logOutput: true,
        sanitizeOutput: () => {
          throw new Error('sanitize fail');
        },
      });
      expect(() => wrapped()).not.toThrow();

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.output).toBe('[sanitize-error]');
    });

    // ── sanitizer-override telemetry (closes AI Trust Gap #3) ──

    it('emits sanitizer_override event when sanitizeInput is provided', () => {
      stderrSpy.mockClear();
      traced(() => 'x', 'overrideIn', {
        category: 'test',
        sanitizeInput: () => '[CUSTOM]',
      });

      const overrideLog = stderrSpy.mock.calls
        .map((c) => {
          try {
            return JSON.parse(c[0] as string);
          } catch {
            return null;
          }
        })
        .find((l) => l?.event === 'sanitizer_override');

      expect(overrideLog).toBeDefined();
      expect(overrideLog.operationName).toBe('overrideIn');
      expect(overrideLog.overrides).toEqual({ input: true, output: false });
    });

    it('emits sanitizer_override event when sanitizeOutput is provided', () => {
      stderrSpy.mockClear();
      traced(() => 'x', 'overrideOut', {
        category: 'test',
        sanitizeOutput: () => '[CUSTOM]',
      });

      const overrideLog = stderrSpy.mock.calls
        .map((c) => {
          try {
            return JSON.parse(c[0] as string);
          } catch {
            return null;
          }
        })
        .find((l) => l?.event === 'sanitizer_override');

      expect(overrideLog).toBeDefined();
      expect(overrideLog.overrides).toEqual({ input: false, output: true });
    });

    it('emits sanitizer_override event when both are provided', () => {
      stderrSpy.mockClear();
      traced(() => 'x', 'overrideBoth', {
        category: 'test',
        sanitizeInput: () => '[CUSTOM]',
        sanitizeOutput: () => '[CUSTOM]',
      });

      const overrideLog = stderrSpy.mock.calls
        .map((c) => {
          try {
            return JSON.parse(c[0] as string);
          } catch {
            return null;
          }
        })
        .find((l) => l?.event === 'sanitizer_override');

      expect(overrideLog).toBeDefined();
      expect(overrideLog.overrides).toEqual({ input: true, output: true });
    });

    it('does NOT emit sanitizer_override when no explicit sanitizer is provided', () => {
      stderrSpy.mockClear();
      traced(() => 'x', 'noOverride', {
        category: 'test',
        logInput: true, // triggers default redactSecrets, NOT an override
        logOutput: true,
      });

      const overrideLog = stderrSpy.mock.calls
        .map((c) => {
          try {
            return JSON.parse(c[0] as string);
          } catch {
            return null;
          }
        })
        .find((l) => l?.event === 'sanitizer_override');

      expect(overrideLog).toBeUndefined();
    });

    it('emits sanitizer_override exactly once per traced() call (factory-time, not invocation-time)', () => {
      stderrSpy.mockClear();
      const wrapped = traced(() => 'x', 'oneShot', {
        category: 'test',
        sanitizeInput: () => '[CUSTOM]',
      });

      // Call the wrapped function multiple times
      wrapped();
      wrapped();
      wrapped();

      const overrideLogs = stderrSpy.mock.calls
        .map((c) => {
          try {
            return JSON.parse(c[0] as string);
          } catch {
            return null;
          }
        })
        .filter((l) => l?.event === 'sanitizer_override');

      expect(overrideLogs).toHaveLength(1);
    });

    // ── SpanEmitter contract (closes AI Trust Gap #4) ──

    function makeEmitter(): {
      emitter: SpanEmitter;
      starts: SpanLifecycleStart[];
      ends: SpanLifecycleEnd[];
    } {
      const starts: SpanLifecycleStart[] = [];
      const ends: SpanLifecycleEnd[] = [];
      return {
        starts,
        ends,
        emitter: {
          onSpanStart: (s) => starts.push(s),
          onSpanEnd: (e) => ends.push(e),
        },
      };
    }

    it('invokes per-call spanEmitter on sync success', () => {
      const { emitter, starts, ends } = makeEmitter();
      const wrapped = traced((x: number) => x * 2, 'syncOp', {
        category: 'test',
        spanEmitter: emitter,
      });

      const result = wrapped(21);
      expect(result).toBe(42);
      expect(starts).toHaveLength(1);
      expect(ends).toHaveLength(1);
      expect(starts[0]!.operationName).toBe('syncOp');
      expect(starts[0]!.category).toBe('test');
      expect(starts[0]!.traceId).toMatch(/^[0-9a-f]{32}$/);
      expect(starts[0]!.spanId).toBe(ends[0]!.spanId);
      expect(ends[0]!.success).toBe(true);
      expect(ends[0]!.error).toBeUndefined();
      expect(ends[0]!.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('invokes per-call spanEmitter on sync failure with error details', () => {
      const { emitter, starts, ends } = makeEmitter();
      const wrapped = traced(
        () => {
          throw new Error('boom');
        },
        'failOp',
        { category: 'test', spanEmitter: emitter }
      );

      expect(() => wrapped()).toThrow('boom');
      expect(starts).toHaveLength(1);
      expect(ends).toHaveLength(1);
      expect(ends[0]!.success).toBe(false);
      expect(ends[0]!.error?.name).toBe('Error');
      expect(ends[0]!.error?.message).toBe('boom');
    });

    it('invokes per-call spanEmitter on async success', async () => {
      const { emitter, starts, ends } = makeEmitter();
      const wrapped = traced(async (x: number) => x + 1, 'asyncOp', {
        category: 'test',
        spanEmitter: emitter,
      });

      const result = await wrapped(5);
      expect(result).toBe(6);
      expect(starts).toHaveLength(1);
      expect(ends).toHaveLength(1);
      expect(ends[0]!.success).toBe(true);
    });

    it('invokes per-call spanEmitter on async failure', async () => {
      const { emitter, starts, ends } = makeEmitter();
      const wrapped = traced(
        async () => {
          throw new Error('async-boom');
        },
        'asyncFail',
        { category: 'test', spanEmitter: emitter }
      );

      await expect(wrapped()).rejects.toThrow('async-boom');
      expect(starts).toHaveLength(1);
      expect(ends).toHaveLength(1);
      expect(ends[0]!.success).toBe(false);
      expect(ends[0]!.error?.message).toBe('async-boom');
    });

    it('uses process-wide default emitter when no per-call override', () => {
      const { emitter, starts, ends } = makeEmitter();
      setDefaultSpanEmitter(emitter);
      try {
        const wrapped = traced(() => 'ok', 'usesDefault', { category: 'test' });
        wrapped();
        expect(starts).toHaveLength(1);
        expect(ends).toHaveLength(1);
      } finally {
        setDefaultSpanEmitter(undefined);
      }
    });

    it('per-call spanEmitter overrides process-wide default', () => {
      const defaultEmitter = makeEmitter();
      const callEmitter = makeEmitter();
      setDefaultSpanEmitter(defaultEmitter.emitter);
      try {
        const wrapped = traced(() => 'ok', 'override', {
          category: 'test',
          spanEmitter: callEmitter.emitter,
        });
        wrapped();
        expect(defaultEmitter.starts).toHaveLength(0);
        expect(callEmitter.starts).toHaveLength(1);
      } finally {
        setDefaultSpanEmitter(undefined);
      }
    });

    it('does NOT call any emitter when none is configured', () => {
      // Default slot is empty by default (test isolation via afterEach).
      expect(getDefaultSpanEmitter()).toBeUndefined();
      const wrapped = traced(() => 'ok', 'noEmitter', { category: 'test' });
      // No assertion on side-effects — just confirm no crash and no emitter
      // exists. Stderr emission still happens; we test that elsewhere.
      expect(() => wrapped()).not.toThrow();
    });

    it('emitter exceptions do not derail the traced operation', () => {
      stderrSpy.mockClear();
      const buggy: SpanEmitter = {
        onSpanStart: () => {
          throw new Error('emitter-bug-start');
        },
        onSpanEnd: () => {
          throw new Error('emitter-bug-end');
        },
      };
      const wrapped = traced(() => 'still-ok', 'buggyEmitter', {
        category: 'test',
        spanEmitter: buggy,
      });

      // Operation succeeds despite emitter throwing
      expect(wrapped()).toBe('still-ok');

      // Both errors get surfaced via stderr (level=warn, event=span_emitter_error)
      const warnings = stderrSpy.mock.calls
        .map((c) => {
          try {
            return JSON.parse(c[0] as string);
          } catch {
            return null;
          }
        })
        .filter((l) => l?.event === 'span_emitter_error');

      expect(warnings.length).toBeGreaterThanOrEqual(2);
      const phases = warnings.map((w) => w.phase).sort();
      expect(phases).toEqual(['end', 'start']);
    });

    it('preserves traceId/spanId pairing between start and end', () => {
      const { emitter, starts, ends } = makeEmitter();
      const wrapped = traced(() => 'ok', 'pair', {
        category: 'test',
        spanEmitter: emitter,
      });

      wrapped();
      wrapped();
      wrapped();

      expect(starts).toHaveLength(3);
      expect(ends).toHaveLength(3);
      for (let i = 0; i < 3; i++) {
        expect(starts[i]!.traceId).toBe(ends[i]!.traceId);
        expect(starts[i]!.spanId).toBe(ends[i]!.spanId);
      }
      // Three separate calls produce three distinct spanIds
      const spanIds = new Set(starts.map((s) => s.spanId));
      expect(spanIds.size).toBe(3);
    });

    it('measures duration accurately for sync functions', () => {
      const fn = () => {
        const start = Date.now();
        while (Date.now() - start < 10) {
          // busy wait
        }
        return 'done';
      };
      const wrapped = traced(fn, 'slowOp', { category: 'test' });
      wrapped();

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.durationMs).toBeGreaterThanOrEqual(5);
    });

    it('propagates the original return value', () => {
      const data = { nested: { value: [1, 2, 3] } };
      const fn = () => data;
      const wrapped = traced(fn, 'complex');
      expect(wrapped()).toBe(data);
    });

    it('propagates thrown errors unchanged', () => {
      const fn = () => {
        throw new Error('expected');
      };
      const wrapped = traced(fn, 'throwing');
      expect(() => wrapped()).toThrow('expected');
    });
  });

  // ── default secret redaction ──

  describe('default secret redaction', () => {
    it('redactSecrets redacts sensitive keys in objects', () => {
      const input = { user: 'alice', privateKey: 'deadbeef', nested: { token: 'abc' } };
      const result = redactSecrets(input) as Record<string, unknown>;
      expect(result.user).toBe('alice');
      expect(result.privateKey).toBe('[REDACTED]');
      expect((result.nested as Record<string, unknown>).token).toBe('[REDACTED]');
    });

    it('redactSecrets passes through primitives and nulls', () => {
      expect(redactSecrets(null)).toBeNull();
      expect(redactSecrets(undefined)).toBeUndefined();
      expect(redactSecrets(42)).toBe(42);
      expect(redactSecrets('hello')).toBe('hello');
    });

    it('redactSecrets handles arrays', () => {
      const input = [{ secret: '123' }, { name: 'bob' }];
      const result = redactSecrets(input) as Record<string, unknown>[];
      expect(result[0]!.secret).toBe('[REDACTED]');
      expect(result[1]!.name).toBe('bob');
    });

    it('applies default redaction when logInput is true and no sanitizeInput', () => {
      const fn = (obj: { password: string; name: string }) => obj.name;
      const wrapped = traced(fn, 'defaultRedactIn', {
        category: 'test',
        logInput: true,
      });
      wrapped({ password: 'hunter2', name: 'alice' });

      const logs = stderrSpy.mock.calls.map((c) => {
        try {
          return JSON.parse(c[0] as string);
        } catch {
          return null;
        }
      });
      const debugLog = logs.find((l) => l && String(l.msg).includes('start'));
      expect(debugLog).toBeDefined();
      const inputArr = debugLog.input as Record<string, unknown>[];
      const firstArg = inputArr[0] as Record<string, unknown>;
      expect(firstArg.password).toBe('[REDACTED]');
      expect(firstArg.name).toBe('alice');
    });

    it('applies default redaction when logOutput is true and no sanitizeOutput', () => {
      const fn = () => ({ apiKey: 'sk-123', status: 'ok' });
      const wrapped = traced(fn, 'defaultRedactOut', {
        category: 'test',
        logOutput: true,
      });
      wrapped();

      const log = getLastLog();
      expect(log).not.toBeNull();
      const output = log!.output as Record<string, unknown>;
      expect(output.apiKey).toBe('[REDACTED]');
      expect(output.status).toBe('ok');
    });

    it('explicit sanitizeInput overrides default redaction', () => {
      const fn = (obj: { secret: string }) => obj.secret;
      const wrapped = traced(fn, 'explicitOverride', {
        category: 'test',
        logInput: true,
        sanitizeInput: () => '[CUSTOM]',
      });
      wrapped({ secret: 'value' });

      const logs = stderrSpy.mock.calls.map((c) => {
        try {
          return JSON.parse(c[0] as string);
        } catch {
          return null;
        }
      });
      const debugLog = logs.find((l) => l && String(l.msg).includes('start'));
      expect(debugLog.input).toBe('[CUSTOM]');
    });

    it('does not apply redaction when logInput is false', () => {
      const fn = (obj: { privateKey: string }) => obj.privateKey;
      const wrapped = traced(fn, 'noRedact', {
        category: 'test',
        logInput: false,
      });
      wrapped({ privateKey: 'should-not-appear' });

      const logs = stderrSpy.mock.calls.map((c) => {
        try {
          return JSON.parse(c[0] as string);
        } catch {
          return null;
        }
      });
      const debugLog = logs.find((l) => l && String(l.msg).includes('start'));
      expect(debugLog.input).toBeUndefined();
    });
  });

  // ── withTrace() ──

  describe('withTrace()', () => {
    it('returns sync function result', () => {
      const result = withTrace(() => 'hello', 'greet');
      expect(result).toBe('hello');
    });

    it('returns async function result', async () => {
      const result = await withTrace(async () => 'async-value', 'asyncOp');
      expect(result).toBe('async-value');
    });

    it('logs completion for sync', () => {
      withTrace(() => 123, 'syncOp', { category: 'test' });

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('info');
      expect(log!.success).toBe(true);
    });

    it('propagates errors', () => {
      expect(() =>
        withTrace(() => {
          throw new Error('inner error');
        }, 'failing')
      ).toThrow('inner error');

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('error');
    });
  });

  // ── createCategoryLogger() ──

  describe('createCategoryLogger()', () => {
    it('returns a logger with all four methods', () => {
      const logger = createCategoryLogger('test');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('info writes structured JSON to stderr', () => {
      const logger = createCategoryLogger('auth');
      logger.info('login success', { userId: 'u123' });

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('info');
      expect(log!.category).toBe('auth');
      expect(log!.msg).toBe('login success');
      expect(log!.userId).toBe('u123');
      expect(log!.ts).toBeDefined();
    });

    it('warn writes structured JSON to stderr', () => {
      const logger = createCategoryLogger('test');
      logger.warn('slow query', { durationMs: 2500 });

      const log = getLastLog();
      expect(log!.level).toBe('warn');
      expect(log!.durationMs).toBe(2500);
    });

    it('error writes structured JSON to stderr', () => {
      const logger = createCategoryLogger('test');
      logger.error('db connection failed');

      const log = getLastLog();
      expect(log!.level).toBe('error');
    });

    it('debug writes structured JSON to stderr', () => {
      const logger = createCategoryLogger('test');
      logger.debug('checkpoint');

      const log = getLastLog();
      expect(log!.level).toBe('debug');
    });

    it('each call returns a new instance', () => {
      const logger1 = createCategoryLogger('a');
      const logger2 = createCategoryLogger('b');
      expect(logger1).not.toBe(logger2);
    });
  });

  // ── Trace Context & Span Propagation ──

  describe('trace context', () => {
    it('getCurrentTraceContext returns undefined outside traced', () => {
      expect(getCurrentTraceContext()).toBeUndefined();
    });

    it('getCurrentTraceContext returns context inside traced sync function', () => {
      const fn = () => getCurrentTraceContext();
      const wrapped = traced(fn, 'ctxSync');
      const ctx = wrapped();
      expect(ctx).toBeDefined();
      expect(typeof ctx!.traceId).toBe('string');
      expect(typeof ctx!.spanId).toBe('string');
      expect(ctx!.parentSpanId).toBeUndefined();
    });

    it('getCurrentTraceContext returns context inside traced async function', async () => {
      const fn = async () => getCurrentTraceContext();
      const wrapped = traced(fn, 'ctxAsync');
      const ctx = await wrapped();
      expect(ctx).toBeDefined();
      expect(typeof ctx!.traceId).toBe('string');
      expect(typeof ctx!.spanId).toBe('string');
    });

    it('nested traced operations inherit traceId and set parentSpanId', () => {
      const childFn = () => getCurrentTraceContext();
      const childTraced = traced(childFn, 'childOp');

      const parentFn = () => childTraced();
      const parentTraced = traced(parentFn, 'parentOp');

      parentTraced();

      const logs = stderrSpy.mock.calls.map((c) => {
        try {
          return JSON.parse(c[0] as string);
        } catch {
          return null;
        }
      });

      const parentLog = logs.find(
        (l) => l && String(l.msg).includes('parentOp') && l.level === 'info'
      );
      const childLog = logs.find(
        (l) => l && String(l.msg).includes('childOp') && l.level === 'info'
      );

      expect(parentLog).toBeDefined();
      expect(childLog).toBeDefined();
      expect(parentLog.traceId).toBe(childLog.traceId);
      expect(parentLog.spanId).toBe(childLog.parentSpanId);
    });

    it('nested async traced operations propagate context across awaits', async () => {
      const childFn = async () => {
        await new Promise((r) => setTimeout(r, 1));
        return getCurrentTraceContext();
      };
      const childTraced = traced(childFn, 'asyncChild');

      const parentFn = async () => {
        await new Promise((r) => setTimeout(r, 1));
        return childTraced();
      };
      const parentTraced = traced(parentFn, 'asyncParent');

      const childCtx = await parentTraced();

      expect(childCtx).toBeDefined();
      const logs = stderrSpy.mock.calls.map((c) => {
        try {
          return JSON.parse(c[0] as string);
        } catch {
          return null;
        }
      });

      const parentLog = logs.find(
        (l) => l && String(l.msg).includes('asyncParent') && l.level === 'info'
      );
      const childLog = logs.find(
        (l) => l && String(l.msg).includes('asyncChild') && l.level === 'info'
      );

      expect(parentLog).toBeDefined();
      expect(childLog).toBeDefined();
      expect(parentLog.traceId).toBe(childLog.traceId);
      expect(parentLog.spanId).toBe(childLog.parentSpanId);
    });

    it('runWithTraceContext sets explicit traceId', () => {
      const ctx = runWithTraceContext(() => getCurrentTraceContext(), {
        traceId: 'explicit-trace-123',
      });
      expect(ctx).toBeDefined();
      expect(ctx!.traceId).toBe('explicit-trace-123');
    });

    it('runWithTraceContext sets explicit parentSpanId', () => {
      const ctx = runWithTraceContext(() => getCurrentTraceContext(), {
        traceId: 't1',
        spanId: 's1',
        parentSpanId: 'p1',
      });
      expect(ctx).toBeDefined();
      expect(ctx!.traceId).toBe('t1');
      expect(ctx!.spanId).toBe('s1');
      expect(ctx!.parentSpanId).toBe('p1');
    });

    it('traced logs include traceId and spanId fields', () => {
      const fn = () => 'ok';
      const wrapped = traced(fn, 'traceFields', { category: 'test' });
      wrapped();

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(typeof log!.traceId).toBe('string');
      expect(typeof log!.spanId).toBe('string');
    });

    it('traced with explicit traceId uses provided value', () => {
      const fn = () => 'ok';
      const wrapped = traced(fn, 'explicitTrace', { category: 'test', traceId: 'my-trace' });
      wrapped();

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.traceId).toBe('my-trace');
    });
  });

  // ── provenance helpers ──

  describe('attachProvenance()', () => {
    it('wraps data with a provenance envelope', () => {
      const data = { result: 42 };
      const provenance = {
        trustLevel: 'verified' as const,
        confidence: 0.95,
        evidenceRefs: [],
        methodologyVersion: { framework: 'test', version: '1.0.0', configurationHash: 'abc' },
        requiresHumanReview: false,
        decisionProvenance: {
          decisionId: 'd-1',
          decisionType: 'test',
          timestamp: Date.now(),
          actor: 'test',
          inputHash: 'in',
          outputHash: 'out',
        },
      };
      const wrapped = attachProvenance(data, provenance);
      expect(wrapped.data).toEqual(data);
      expect(wrapped.provenance.confidence).toBe(0.95);
    });
  });

  describe('createProvenanceLogger()', () => {
    it('logs provenance records as structured JSON', () => {
      const pl = createProvenanceLogger('test-provenance');
      const provenance = {
        trustLevel: 'verified' as const,
        confidence: 0.92,
        evidenceRefs: [
          {
            evidenceId: 'ev-1',
            evidenceType: 'sensor',
            source: 's1',
            timestamp: Date.now(),
            relevanceScore: 0.9,
          },
        ],
        methodologyVersion: { framework: 'cortex', version: '2.0.0', configurationHash: 'hash' },
        requiresHumanReview: false,
        decisionProvenance: {
          decisionId: 'd-1',
          decisionType: 'anomaly',
          timestamp: Date.now(),
          actor: 'cortex',
          inputHash: 'in',
          outputHash: 'out',
        },
      };
      pl.logProvenance(provenance);

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.msg).toBe('provenance_record');
      expect(log!.trustLevel).toBe('verified');
      expect(log!.evidenceCount).toBe(1);
    });

    it('logs provenance without optional context', () => {
      const pl = createProvenanceLogger('test-provenance');
      const provenance = {
        trustLevel: 'verified' as const,
        confidence: 0.92,
        evidenceRefs: [],
        methodologyVersion: { framework: 'cortex', version: '2.0.0', configurationHash: 'hash' },
        requiresHumanReview: false,
        decisionProvenance: {
          decisionId: 'd-1',
          decisionType: 'anomaly',
          timestamp: Date.now(),
          actor: 'cortex',
          inputHash: 'in',
          outputHash: 'out',
        },
      };
      pl.logProvenance(provenance);

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.msg).toBe('provenance_record');
    });

    it('logs evaluation at warn level when review is required', () => {
      const pl = createProvenanceLogger('test-provenance');
      const provenance = {
        trustLevel: 'uncertain' as const,
        confidence: 0.4,
        evidenceRefs: [],
        methodologyVersion: { framework: 'cortex', version: '2.0.0', configurationHash: 'hash' },
        requiresHumanReview: true,
        decisionProvenance: {
          decisionId: 'd-1',
          decisionType: 'anomaly',
          timestamp: Date.now(),
          actor: 'cortex',
          inputHash: 'in',
          outputHash: 'out',
        },
      };
      pl.logEvaluation(provenance, 'escalate', 'low confidence');

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('warn');
      expect(log!.action).toBe('escalate');
      expect(log!.reason).toBe('low confidence');
    });

    it('logs evaluation at info level when review is not required', () => {
      const pl = createProvenanceLogger('test-provenance');
      const provenance = {
        trustLevel: 'verified' as const,
        confidence: 0.92,
        evidenceRefs: [],
        methodologyVersion: { framework: 'cortex', version: '2.0.0', configurationHash: 'hash' },
        requiresHumanReview: false,
        decisionProvenance: {
          decisionId: 'd-1',
          decisionType: 'anomaly',
          timestamp: Date.now(),
          actor: 'cortex',
          inputHash: 'in',
          outputHash: 'out',
        },
      };
      pl.logEvaluation(provenance, 'approve', 'high confidence');

      const log = getLastLog();
      expect(log).not.toBeNull();
      expect(log!.level).toBe('info');
      expect(log!.action).toBe('approve');
    });
  });

  describe('safeEmit', () => {
    it('handles non-error throws in emitter callbacks', () => {
      stderrSpy.mockClear();
      const buggy: SpanEmitter = {
        onSpanStart: () => {
          throw 'string-throw';
        },
        onSpanEnd: () => {
          throw 'string-throw';
        },
      };
      const wrapped = traced(() => 'still-ok', 'stringThrow', {
        category: 'test',
        spanEmitter: buggy,
      });
      expect(wrapped()).toBe('still-ok');

      const warnings = stderrSpy.mock.calls
        .map((c) => {
          try {
            return JSON.parse(c[0] as string);
          } catch {
            return null;
          }
        })
        .filter((l) => l?.event === 'span_emitter_error');

      expect(warnings.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('runWithTraceContext', () => {
    it('generates traceId when context is omitted', () => {
      const ctx = runWithTraceContext(() => getCurrentTraceContext());
      expect(ctx).toBeDefined();
      expect(ctx!.traceId).toBeDefined();
      expect(ctx!.traceId.length).toBe(32);
    });

    it('generates spanId when only traceId is provided', () => {
      const ctx = runWithTraceContext(() => getCurrentTraceContext(), { traceId: 'custom-trace' });
      expect(ctx).toBeDefined();
      expect(ctx!.traceId).toBe('custom-trace');
      expect(ctx!.spanId).toBeDefined();
      expect(ctx!.spanId.length).toBe(16);
    });
  });
});
