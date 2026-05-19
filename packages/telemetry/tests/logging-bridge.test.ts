import { describe, it, expect } from 'vitest';

import { runWithSpanContext } from '../src/context';
import { createTelemetryLogger } from '../src/logging-bridge';
import { createSpanContext } from '../src/tracing';

describe('createTelemetryLogger', () => {
  it('logs at all levels without span context', () => {
    const logger = createTelemetryLogger('test-service');
    expect(() => {
      logger.debug('debug msg', { key: 'val' });
      logger.info('info msg', { key: 'val' });
      logger.warn('warn msg', { key: 'val' });
      logger.error('error msg', { key: 'val' });
      logger.fatal('fatal msg', { key: 'val' });
    }).not.toThrow();
  });

  it('logs with span context when available', () => {
    const logger = createTelemetryLogger('test-service');
    const ctx = createSpanContext();

    runWithSpanContext(ctx, () => {
      expect(() => {
        logger.info('with context', { extra: true });
      }).not.toThrow();
    });
  });

  it('creates child logger with merged metadata', () => {
    const logger = createTelemetryLogger('test-service', { env: 'test' });
    const child = logger.child({ module: 'auth' });
    expect(child).toBeDefined();
    expect(() => child.info('child log')).not.toThrow();
  });
});
