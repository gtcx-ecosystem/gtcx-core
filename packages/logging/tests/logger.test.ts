import { describe, it, expect, vi } from 'vitest';

import { Logger, createLogger, LogEntry } from '../src/index';

/**
 * Helper that creates a logger with a capturing output handler.
 * Returns the logger and an array that accumulates all emitted LogEntry objects.
 */
function createTestLogger(overrides: Partial<Parameters<typeof createLogger>[0]> = {}) {
  const entries: LogEntry[] = [];
  const logger = createLogger({
    service: 'test-service',
    output: (entry) => entries.push(entry),
    ...overrides,
  });
  return { logger, entries };
}

// ============================================================================
// Logger creation
// ============================================================================

describe('Logger creation', () => {
  it('should create a logger with default config', () => {
    const { logger, entries } = createTestLogger();
    logger.info('hello');
    expect(entries).toHaveLength(1);
    expect(entries[0].service).toBe('test-service');
    expect(entries[0].level).toBe('info');
    expect(entries[0].message).toBe('hello');
  });

  it('should create a logger via the createLogger factory function', () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({
      service: 'factory-service',
      output: (entry) => entries.push(entry),
    });
    logger.info('created');
    expect(entries).toHaveLength(1);
    expect(entries[0].service).toBe('factory-service');
  });
});

// ============================================================================
// Log levels
// ============================================================================

describe('Log levels', () => {
  it('should produce a debug-level entry', () => {
    const { logger, entries } = createTestLogger();
    logger.debug('debug message');
    expect(entries[0].level).toBe('debug');
    expect(entries[0].message).toBe('debug message');
  });

  it('should produce an info-level entry', () => {
    const { logger, entries } = createTestLogger();
    logger.info('info message');
    expect(entries[0].level).toBe('info');
  });

  it('should produce a warn-level entry', () => {
    const { logger, entries } = createTestLogger();
    logger.warn('warn message');
    expect(entries[0].level).toBe('warn');
  });

  it('should produce an error-level entry', () => {
    const { logger, entries } = createTestLogger();
    logger.error('error message');
    expect(entries[0].level).toBe('error');
  });

  it('should produce a fatal-level entry', () => {
    const { logger, entries } = createTestLogger();
    logger.fatal('fatal message');
    expect(entries[0].level).toBe('fatal');
  });
});

// ============================================================================
// Level filtering
// ============================================================================

describe('Level filtering', () => {
  it('should filter debug messages when level is set to info', () => {
    const { logger, entries } = createTestLogger({ level: 'info' });
    logger.debug('should be filtered');
    logger.info('should appear');
    expect(entries).toHaveLength(1);
    expect(entries[0].message).toBe('should appear');
  });

  it('should filter debug and info when level is set to warn', () => {
    const { logger, entries } = createTestLogger({ level: 'warn' });
    logger.debug('filtered');
    logger.info('filtered');
    logger.warn('visible');
    logger.error('visible');
    logger.fatal('visible');
    expect(entries).toHaveLength(3);
    expect(entries.map((e) => e.level)).toEqual(['warn', 'error', 'fatal']);
  });

  it('should allow all messages when level is debug', () => {
    const { logger, entries } = createTestLogger({ level: 'debug' });
    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');
    logger.fatal('f');
    expect(entries).toHaveLength(5);
  });
});

// ============================================================================
// Correlation ID
// ============================================================================

describe('Correlation ID', () => {
  it('should include correlationId in log entries when configured', () => {
    const { logger, entries } = createTestLogger({ correlationId: 'req-123' });
    logger.info('with correlation');
    expect(entries[0].correlationId).toBe('req-123');
  });

  it('should not include correlationId when not configured', () => {
    const { logger, entries } = createTestLogger();
    logger.info('without correlation');
    expect(entries[0].correlationId).toBeUndefined();
  });
});

// ============================================================================
// Child logger
// ============================================================================

describe('Child logger', () => {
  it('should inherit parent config in child logger', () => {
    const { logger, entries } = createTestLogger({
      service: 'parent-service',
      correlationId: 'parent-corr',
    });
    const child = logger.child({});
    child.info('child message');
    expect(entries).toHaveLength(1);
    expect(entries[0].service).toBe('parent-service');
    expect(entries[0].correlationId).toBe('parent-corr');
  });

  it('should allow child to override specific config', () => {
    const { logger, entries } = createTestLogger({
      service: 'parent-service',
      correlationId: 'parent-corr',
    });
    const child = logger.child({
      service: 'child-service',
      correlationId: 'child-corr',
    });
    child.info('overridden');
    expect(entries[0].service).toBe('child-service');
    expect(entries[0].correlationId).toBe('child-corr');
  });

  it('should allow child to override log level', () => {
    const parentEntries: LogEntry[] = [];
    const parent = createLogger({
      service: 'parent',
      level: 'debug',
      output: (entry) => parentEntries.push(entry),
    });
    const child = parent.child({ level: 'error' });
    child.debug('should be filtered');
    child.info('should be filtered');
    child.error('should appear');
    expect(parentEntries).toHaveLength(1);
    expect(parentEntries[0].level).toBe('error');
  });
});

// ============================================================================
// Error serialization
// ============================================================================

describe('Error serialization', () => {
  it('should serialize error name, message, and stack', () => {
    const { logger, entries } = createTestLogger();
    const err = new Error('something went wrong');
    err.name = 'CustomError';
    logger.error('operation failed', err);
    expect(entries[0].error).toBeDefined();
    expect(entries[0].error!.name).toBe('CustomError');
    expect(entries[0].error!.message).toBe('something went wrong');
    expect(entries[0].error!.stack).toBeDefined();
    expect(entries[0].error!.stack).toContain('CustomError');
  });

  it('should include both error and data when provided together', () => {
    const { logger, entries } = createTestLogger();
    const err = new Error('db timeout');
    logger.error('query failed', err, { query: 'SELECT 1', retries: 3 });
    expect(entries[0].error!.message).toBe('db timeout');
    expect(entries[0].data).toEqual({ query: 'SELECT 1', retries: 3 });
  });

  it('should handle error without stack gracefully', () => {
    const { logger, entries } = createTestLogger();
    const err = new Error('no stack');
    err.stack = undefined;
    logger.error('stackless', err);
    expect(entries[0].error!.stack).toBeUndefined();
  });
});

// ============================================================================
// Timer helper
// ============================================================================

describe('Timer helper', () => {
  it('should measure elapsed duration in milliseconds', async () => {
    const { logger } = createTestLogger();
    const elapsed = logger.startTimer();
    // Wait at least 50ms
    await new Promise((resolve) => setTimeout(resolve, 50));
    const duration = elapsed();
    expect(duration).toBeGreaterThanOrEqual(40); // allow small variance
    expect(typeof duration).toBe('number');
  });

  it('should return 0 or near-zero for immediate calls', () => {
    const { logger } = createTestLogger();
    const elapsed = logger.startTimer();
    const duration = elapsed();
    expect(duration).toBeGreaterThanOrEqual(0);
    expect(duration).toBeLessThan(50);
  });
});

// ============================================================================
// generateCorrelationId
// ============================================================================

describe('generateCorrelationId', () => {
  it('should produce unique IDs across multiple calls', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(Logger.generateCorrelationId());
    }
    expect(ids.size).toBe(100);
  });

  it('should produce a string containing a hyphen separator', () => {
    const id = Logger.generateCorrelationId();
    expect(typeof id).toBe('string');
    expect(id).toContain('-');
  });

  it('should produce IDs with hex characters', () => {
    const id = Logger.generateCorrelationId();
    // The ID should be a valid UUID v4 format
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });
});

// ============================================================================
// Custom output handler
// ============================================================================

describe('Custom output handler', () => {
  it('should call the custom output function with the log entry', () => {
    const outputFn = vi.fn();
    const logger = createLogger({ service: 'custom-output', output: outputFn });
    logger.info('test');
    expect(outputFn).toHaveBeenCalledTimes(1);
    const entry = outputFn.mock.calls[0][0] as LogEntry;
    expect(entry.message).toBe('test');
    expect(entry.service).toBe('custom-output');
  });
});

// ============================================================================
// JSON output format
// ============================================================================

describe('JSON output format', () => {
  it('should produce valid JSON with all required fields', () => {
    const { logger, entries } = createTestLogger({ correlationId: 'json-test' });
    logger.info('validate format', { key: 'value' });

    const entry = entries[0];
    // Verify the entry can round-trip through JSON
    const json = JSON.stringify(entry);
    const parsed = JSON.parse(json) as LogEntry;
    expect(parsed.timestamp).toBeDefined();
    expect(parsed.level).toBe('info');
    expect(parsed.message).toBe('validate format');
    expect(parsed.service).toBe('test-service');
    expect(parsed.correlationId).toBe('json-test');
    expect(parsed.data).toEqual({ key: 'value' });
  });

  it('should produce an ISO 8601 timestamp', () => {
    const { logger, entries } = createTestLogger();
    logger.info('timestamp check');
    const timestamp = entries[0].timestamp;
    // ISO 8601 pattern: YYYY-MM-DDTHH:mm:ss.sssZ
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should write to stdout for non-error levels via default output', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const logger = createLogger({ service: 'stdout-test' });
    logger.info('to stdout');
    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const written = stdoutSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(written.trim()) as LogEntry;
    expect(parsed.level).toBe('info');
    expect(parsed.message).toBe('to stdout');
    stdoutSpy.mockRestore();
  });

  it('should write to stderr for error and fatal levels via default output', () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const logger = createLogger({ service: 'stderr-test' });
    logger.error('to stderr');
    logger.fatal('also to stderr');
    expect(stderrSpy).toHaveBeenCalledTimes(2);
    const firstParsed = JSON.parse((stderrSpy.mock.calls[0][0] as string).trim()) as LogEntry;
    const secondParsed = JSON.parse((stderrSpy.mock.calls[1][0] as string).trim()) as LogEntry;
    expect(firstParsed.level).toBe('error');
    expect(secondParsed.level).toBe('fatal');
    stderrSpy.mockRestore();
  });
});

// ============================================================================
// Data attachment
// ============================================================================

describe('Data attachment', () => {
  it('should attach arbitrary data to log entries', () => {
    const { logger, entries } = createTestLogger();
    logger.info('with data', { userId: 42, action: 'login', nested: { a: 1 } });
    expect(entries[0].data).toEqual({ userId: 42, action: 'login', nested: { a: 1 } });
  });

  it('should not include data field when no data is provided', () => {
    const { logger, entries } = createTestLogger();
    logger.info('no data');
    expect(entries[0].data).toBeUndefined();
  });
});
