/**
 * @gtcx/ai — Coverage gap tests
 */

import { describe, it, expect, vi } from 'vitest';

import { traced, createCategoryLogger } from '../src/index';

describe('writer.ts — process.stderr fallback', () => {
  it('writeLog does not throw when process.stderr is missing', async () => {
    const { writeLog } = await import('../src/writer');
    const originalStderr = Object.getOwnPropertyDescriptor(process, 'stderr');
    Object.defineProperty(process, 'stderr', {
      value: undefined,
      configurable: true,
      enumerable: true,
    });
    try {
      expect(() => writeLog('info', 'test', {})).not.toThrow();
    } finally {
      if (originalStderr) {
        Object.defineProperty(process, 'stderr', originalStderr);
      }
    }
  });
});

describe('provenance.ts — createCategoryLogger error/debug branches', () => {
  it('error and debug methods work', () => {
    const originalStderr = Object.getOwnPropertyDescriptor(process, 'stderr');
    Object.defineProperty(process, 'stderr', {
      value: undefined,
      configurable: true,
      enumerable: true,
    });
    try {
      const logger = createCategoryLogger('test-cat');
      expect(() => logger.error('err')).not.toThrow();
      expect(() => logger.debug('dbg')).not.toThrow();
    } finally {
      if (originalStderr) {
        Object.defineProperty(process, 'stderr', originalStderr);
      }
    }
  });
});

describe('trace-context.ts — global store already exists', () => {
  it('reuses existing global trace store', async () => {
    const key = '__gtcx_ai_trace_store__';
    const existing = { getStore: () => undefined, run: <T>(_store: unknown, fn: () => T) => fn() };
    // @ts-expect-error setting global
    globalThis[key] = existing;

    vi.resetModules();
    const mod = await import('../src/trace-context');
    expect(mod.traceStore).toBe(existing);

    // cleanup
    // @ts-expect-error deleting global
    delete globalThis[key];
  });
});

describe('traced.ts — sanitizeInput catch branch', () => {
  it('handles sanitizeInput error gracefully', () => {
    const fn = (x: number) => x;
    const wrapped = traced(fn, 'badInputSanitize', {
      category: 'test',
      logInput: true,
      sanitizeInput: () => {
        throw new Error('sanitize fail');
      },
    });
    expect(() => wrapped(42)).not.toThrow();
  });
});

describe('traced.ts — non-Error throw', () => {
  it('handles thrown string gracefully', () => {
    const fn = () => {
      throw 'string-error';
    };
    const wrapped = traced(fn, 'stringThrow', { category: 'test' });
    expect(() => wrapped()).toThrow('string-error');
  });
});
