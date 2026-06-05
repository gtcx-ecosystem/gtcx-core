import { describe, expect, it } from 'vitest';

import { createCategoryLogger, traced } from '../src/tracing';

describe('crypto tracing adapter', () => {
  it('returns a callable traced wrapper without @gtcx/ai', () => {
    const wrapped = traced((value: number) => value + 1, 'increment', {
      category: 'crypto-test',
    });

    expect(wrapped(2)).toBe(3);
  });

  it('creates a no-op category logger with the standard logging methods', () => {
    const logger = createCategoryLogger('crypto-test');

    expect(() => {
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      logger.debug('debug');
    }).not.toThrow();
  });
});
