import { describe, expect, it } from 'vitest';

import { createCategoryLogger, traced, withTrace } from '../src/tracing';

describe('verification tracing adapter', () => {
  it('returns a callable traced wrapper without @gtcx/ai', () => {
    const wrapped = traced((value: number) => value + 1, 'increment', {
      category: 'verification-test',
    });

    expect(wrapped(2)).toBe(3);
  });

  it('executes work through the fallback withTrace implementation', () => {
    const result = withTrace(
      () => ({
        ok: true,
        timestamp: 123,
      }),
      'collect-proof',
      { category: 'verification-test' }
    );

    expect(result).toEqual({ ok: true, timestamp: 123 });
  });

  it('creates a no-op category logger with the standard logging methods', () => {
    const logger = createCategoryLogger('verification-test');

    expect(() => {
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      logger.debug('debug');
    }).not.toThrow();
  });
});
