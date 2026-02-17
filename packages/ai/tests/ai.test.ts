import { describe, it, expect } from 'vitest';

import { traced, withTrace, createCategoryLogger } from '../src/index';

describe('@gtcx/ai', () => {
  describe('traced()', () => {
    it('returns the original function unchanged (stub behavior)', () => {
      const fn = (x: number) => x * 2;
      const result = traced(fn, 'multiply');
      expect(result).toBe(fn);
    });

    it('result is callable and returns the correct value', () => {
      const fn = (a: number, b: number) => a + b;
      const wrapped = traced(fn, 'add');
      expect(wrapped(3, 4)).toBe(7);
    });

    it('preserves function signature for sync functions', () => {
      const fn = (name: string, age: number): string => `${name} is ${age}`;
      const wrapped = traced(fn, 'format');
      expect(wrapped('Alice', 30)).toBe('Alice is 30');
    });

    it('preserves function signature for async functions', async () => {
      const fn = async (x: number): Promise<number> => x * 3;
      const wrapped = traced(fn, 'asyncMultiply');
      const result = await wrapped(5);
      expect(result).toBe(15);
    });

    it('accepts options parameter without errors', () => {
      const fn = (x: number) => x;
      expect(() =>
        traced(fn, 'op', {
          logInput: true,
          logOutput: true,
          metadata: { env: 'test' },
          category: 'unit-test',
        })
      ).not.toThrow();
    });

    it('accepts sanitizeInput and sanitizeOutput options', () => {
      const fn = (x: number) => x;
      const wrapped = traced(fn, 'op', {
        sanitizeInput: (_input) => ({ redacted: true }),
        sanitizeOutput: (_output) => ({ redacted: true }),
      });
      expect(wrapped).toBe(fn);
    });

    it('multiple traced wrappings do not cause issues', () => {
      const fn = (x: number) => x + 1;
      const once = traced(fn, 'first');
      const twice = traced(once, 'second');
      const thrice = traced(twice, 'third');
      expect(thrice(10)).toBe(11);
    });

    it('works with functions that throw errors', () => {
      const fn = () => {
        throw new Error('expected');
      };
      const wrapped = traced(fn, 'throwing');
      expect(() => wrapped()).toThrow('expected');
    });

    it('works with functions that take no arguments', () => {
      const fn = () => 42;
      const wrapped = traced(fn, 'constant');
      expect(wrapped()).toBe(42);
    });

    it('works with functions returning complex objects', () => {
      const data = { nested: { value: [1, 2, 3] } };
      const fn = () => data;
      const wrapped = traced(fn, 'complex');
      expect(wrapped()).toBe(data);
    });
  });

  describe('withTrace()', () => {
    it('returns the function result for sync functions', () => {
      const result = withTrace(() => 'hello', 'greet');
      expect(result).toBe('hello');
    });

    it('works with async functions', async () => {
      const result = await withTrace(async () => 'async-value', 'asyncOp');
      expect(result).toBe('async-value');
    });

    it('returns the result when called without operation name', () => {
      const result = withTrace(() => 123);
      expect(result).toBe(123);
    });

    it('accepts options parameter without errors', () => {
      const result = withTrace(() => 'ok', 'op', {
        logInput: true,
        logOutput: false,
        metadata: { key: 'value' },
        category: 'test-category',
      });
      expect(result).toBe('ok');
    });

    it('propagates errors from the wrapped function', () => {
      expect(() =>
        withTrace(() => {
          throw new Error('inner error');
        }, 'failing')
      ).toThrow('inner error');
    });

    it('returns complex objects', () => {
      const obj = { a: 1, b: [2, 3] };
      const result = withTrace(() => obj, 'complex');
      expect(result).toBe(obj);
    });

    it('returns undefined when function returns nothing', () => {
      const result = withTrace(() => {}, 'void');
      expect(result).toBeUndefined();
    });
  });

  describe('createCategoryLogger()', () => {
    it('returns an object with info, warn, error, and debug methods', () => {
      const logger = createCategoryLogger('test');
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('info() does not throw when called', () => {
      const logger = createCategoryLogger('test');
      expect(() => logger.info('message')).not.toThrow();
    });

    it('warn() does not throw when called', () => {
      const logger = createCategoryLogger('test');
      expect(() => logger.warn('warning')).not.toThrow();
    });

    it('error() does not throw when called', () => {
      const logger = createCategoryLogger('test');
      expect(() => logger.error('error')).not.toThrow();
    });

    it('debug() does not throw when called', () => {
      const logger = createCategoryLogger('test');
      expect(() => logger.debug('debug')).not.toThrow();
    });

    it('info() accepts message and data arguments', () => {
      const logger = createCategoryLogger('test');
      expect(() => logger.info('msg', { key: 'value' })).not.toThrow();
    });

    it('warn() accepts message and extra arguments', () => {
      const logger = createCategoryLogger('test');
      expect(() => logger.warn('msg', { detail: 'x' }, 'extra')).not.toThrow();
    });

    it('error() accepts message and extra arguments', () => {
      const logger = createCategoryLogger('test');
      expect(() => logger.error('msg', new Error('test'), { context: true })).not.toThrow();
    });

    it('debug() accepts message and data arguments', () => {
      const logger = createCategoryLogger('test');
      expect(() => logger.debug('msg', { verbose: true })).not.toThrow();
    });

    it('methods return undefined (no-op)', () => {
      const logger = createCategoryLogger('test');
      expect(logger.info('msg')).toBeUndefined();
      expect(logger.warn('msg')).toBeUndefined();
      expect(logger.error('msg')).toBeUndefined();
      expect(logger.debug('msg')).toBeUndefined();
    });

    it('works with different category names', () => {
      const logger1 = createCategoryLogger('auth');
      const logger2 = createCategoryLogger('verification');
      const logger3 = createCategoryLogger('');

      expect(() => logger1.info('test')).not.toThrow();
      expect(() => logger2.info('test')).not.toThrow();
      expect(() => logger3.info('test')).not.toThrow();
    });

    it('each call returns a new logger instance', () => {
      const logger1 = createCategoryLogger('a');
      const logger2 = createCategoryLogger('b');
      expect(logger1).not.toBe(logger2);
    });
  });
});
