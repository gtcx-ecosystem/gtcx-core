import { describe, it, expect, beforeEach } from 'vitest';

import {
  InMemoryOperationLogger,
  nullOperationLogger,
  detectAnomalies,
  suggestNextOperations,
} from '../src/ai-logging';
import type { OperationLogEntry } from '../src/ai-logging';

// ---------------------------------------------------------------------------
// InMemoryOperationLogger
// ---------------------------------------------------------------------------

describe('InMemoryOperationLogger', () => {
  let logger: InMemoryOperationLogger;

  beforeEach(() => {
    logger = new InMemoryOperationLogger();
  });

  // -- start --
  describe('start', () => {
    it('returns an operation id starting with "op_"', () => {
      const id = logger.start('registration.validate');
      expect(id).toMatch(/^op_/);
    });

    it('creates an entry with started status', () => {
      const id = logger.start('registration.register');
      const entry = logger.get(id);
      expect(entry).toBeDefined();
      expect(entry!.status).toBe('started');
      expect(entry!.type).toBe('registration.register');
      expect(entry!.startTime).toBeTypeOf('number');
    });

    it('stores sanitized input (redacts PII keys)', () => {
      const id = logger.start('registration.validate', {
        commodityType: 'gold',
        email: 'user@example.com',
        phone: '+1234567890',
        weight: 100,
      });
      const entry = logger.get(id)!;
      expect(entry.input!.commodityType).toBe('gold');
      expect(entry.input!.email).toBe('[REDACTED]');
      expect(entry.input!.phone).toBe('[REDACTED]');
      expect(entry.input!.weight).toBe(100);
    });

    it('sanitizes nested objects and arrays in input', () => {
      const id = logger.start('registration.validate', {
        details: { nested: 'value' },
        items: [1, 2, 3],
      });
      const entry = logger.get(id)!;
      expect(entry.input!.details).toBe('[Object]');
      expect(entry.input!.items).toBe('[Array(3)]');
    });

    it('records parentId, correlationId, and tags', () => {
      const id = logger.start('registration.validate', undefined, {
        parentId: 'parent-1',
        correlationId: 'corr-1',
        tags: ['important'],
      });
      const entry = logger.get(id)!;
      expect(entry.parentId).toBe('parent-1');
      expect(entry.correlationId).toBe('corr-1');
      expect(entry.tags).toEqual(['important']);
    });
  });

  // -- success --
  describe('success', () => {
    it('marks operation as success with duration', () => {
      const id = logger.start('trading.calculate_price');
      logger.success(id, { result: 100 });
      const entry = logger.get(id)!;
      expect(entry.status).toBe('success');
      expect(entry.endTime).toBeTypeOf('number');
      expect(entry.duration).toBeTypeOf('number');
      expect(entry.duration).toBeGreaterThanOrEqual(0);
      expect(entry.output).toEqual({ result: 100 });
    });

    it('stores aiContext', () => {
      const id = logger.start('registration.validate');
      logger.success(id, undefined, {
        anomalies: ['slow'],
        confidence: 0.9,
      });
      const entry = logger.get(id)!;
      expect(entry.aiContext!.anomalies).toEqual(['slow']);
      expect(entry.aiContext!.confidence).toBe(0.9);
    });

    it('does nothing for unknown operationId', () => {
      // should not throw
      logger.success('nonexistent', { x: 1 });
    });
  });

  // -- fail --
  describe('fail', () => {
    it('marks operation as failed with Error object', () => {
      const id = logger.start('trading.execute_trade');
      const err = new Error('boom');
      logger.fail(id, err, 'TRADE_ERR');
      const entry = logger.get(id)!;
      expect(entry.status).toBe('failed');
      expect(entry.error!.message).toBe('boom');
      expect(entry.error!.code).toBe('TRADE_ERR');
      expect(entry.error!.stack).toBeDefined();
    });

    it('marks operation as failed with string error', () => {
      const id = logger.start('trading.execute_trade');
      logger.fail(id, 'string error');
      const entry = logger.get(id)!;
      expect(entry.error!.message).toBe('string error');
      expect(entry.error!.stack).toBeUndefined();
    });

    it('does nothing for unknown operationId', () => {
      logger.fail('nonexistent', 'err');
    });
  });

  // -- skip --
  describe('skip', () => {
    it('marks operation as skipped with reason', () => {
      const id = logger.start('compliance.check_asset');
      logger.skip(id, 'not applicable');
      const entry = logger.get(id)!;
      expect(entry.status).toBe('skipped');
      expect(entry.output).toEqual({ skipReason: 'not applicable' });
      expect(entry.duration).toBeTypeOf('number');
    });

    it('does nothing for unknown operationId', () => {
      logger.skip('nonexistent', 'reason');
    });
  });

  // -- addTags --
  describe('addTags', () => {
    it('appends tags to existing', () => {
      const id = logger.start('registration.validate', undefined, { tags: ['a'] });
      logger.addTags(id, ['b', 'c']);
      expect(logger.get(id)!.tags).toEqual(['a', 'b', 'c']);
    });

    it('creates tag array when none existed', () => {
      const id = logger.start('registration.validate');
      logger.addTags(id, ['x']);
      expect(logger.get(id)!.tags).toEqual(['x']);
    });

    it('does nothing for unknown operationId', () => {
      logger.addTags('nonexistent', ['x']);
    });
  });

  // -- getByCorrelationId --
  describe('getByCorrelationId', () => {
    it('returns entries sorted by startTime', () => {
      const id1 = logger.start('registration.validate', undefined, { correlationId: 'c1' });
      const id2 = logger.start('registration.register', undefined, { correlationId: 'c1' });
      logger.start('trading.calculate_price', undefined, { correlationId: 'c2' });

      const results = logger.getByCorrelationId('c1');
      expect(results).toHaveLength(2);
      expect(results[0].operationId).toBe(id1);
      expect(results[1].operationId).toBe(id2);
    });

    it('returns empty array when no matches', () => {
      expect(logger.getByCorrelationId('nonexistent')).toEqual([]);
    });
  });

  // -- getAll, getByType, getFailed, getAnomalies --
  describe('query methods', () => {
    it('getAll returns all operations', () => {
      logger.start('registration.validate');
      logger.start('trading.calculate_price');
      expect(logger.getAll()).toHaveLength(2);
    });

    it('getByType filters by type', () => {
      logger.start('registration.validate');
      logger.start('registration.validate');
      logger.start('trading.calculate_price');
      expect(logger.getByType('registration.validate')).toHaveLength(2);
    });

    it('getFailed returns only failed operations', () => {
      const id1 = logger.start('registration.validate');
      const id2 = logger.start('trading.calculate_price');
      logger.fail(id1, 'err');
      logger.success(id2);
      expect(logger.getFailed()).toHaveLength(1);
    });

    it('getAnomalies returns entries with anomalies', () => {
      const id1 = logger.start('registration.validate');
      const id2 = logger.start('trading.calculate_price');
      logger.success(id1, undefined, { anomalies: ['slow'] });
      logger.success(id2);
      expect(logger.getAnomalies()).toHaveLength(1);
    });
  });

  // -- clear --
  describe('clear', () => {
    it('removes all operations', () => {
      logger.start('registration.validate');
      logger.start('trading.calculate_price');
      logger.clear();
      expect(logger.getAll()).toHaveLength(0);
    });
  });

  // -- pruning --
  describe('pruning', () => {
    it('removes oldest entries when exceeding maxEntries', () => {
      const small = new InMemoryOperationLogger(3);
      small.start('registration.validate');
      small.start('registration.register');
      small.start('registration.generate_proof');
      // This should trigger pruning
      small.start('trading.calculate_price');
      expect(small.getAll().length).toBeLessThanOrEqual(3);
    });
  });
});

// ---------------------------------------------------------------------------
// nullOperationLogger
// ---------------------------------------------------------------------------

describe('nullOperationLogger', () => {
  it('start always returns "null"', () => {
    expect(nullOperationLogger.start('registration.validate')).toBe('null');
  });

  it('other methods are no-ops', () => {
    nullOperationLogger.success('x');
    nullOperationLogger.fail('x', 'err');
    nullOperationLogger.skip('x', 'reason');
    nullOperationLogger.addTags('x', ['a']);
    expect(nullOperationLogger.get('x')).toBeUndefined();
    expect(nullOperationLogger.getByCorrelationId('c')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// detectAnomalies
// ---------------------------------------------------------------------------

describe('detectAnomalies', () => {
  it('detects slow operations', () => {
    const entry: OperationLogEntry = {
      operationId: 'op-1',
      type: 'registration.validate',
      status: 'success',
      startTime: 0,
      duration: 10000,
    };
    const anomalies = detectAnomalies(entry);
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0]).toContain('Slow operation');
  });

  it('detects large input', () => {
    const input: Record<string, unknown> = {};
    for (let i = 0; i < 150; i++) input[`key${i}`] = i;
    const entry: OperationLogEntry = {
      operationId: 'op-1',
      type: 'registration.validate',
      status: 'success',
      startTime: 0,
      input,
    };
    const anomalies = detectAnomalies(entry);
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0]).toContain('Large input');
  });

  it('returns empty for normal operations', () => {
    const entry: OperationLogEntry = {
      operationId: 'op-1',
      type: 'registration.validate',
      status: 'success',
      startTime: 0,
      duration: 100,
      input: { x: 1 },
    };
    expect(detectAnomalies(entry)).toEqual([]);
  });

  it('accepts custom thresholds', () => {
    const entry: OperationLogEntry = {
      operationId: 'op-1',
      type: 'registration.validate',
      status: 'success',
      startTime: 0,
      duration: 200,
    };
    expect(detectAnomalies(entry, { maxDuration: 100 })).toHaveLength(1);
    expect(detectAnomalies(entry, { maxDuration: 500 })).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// suggestNextOperations
// ---------------------------------------------------------------------------

describe('suggestNextOperations', () => {
  it('suggests register after validate', () => {
    expect(suggestNextOperations('registration.validate')).toEqual(['registration.register']);
  });

  it('suggests multiple after registration.register', () => {
    const suggestions = suggestNextOperations('registration.register');
    expect(suggestions).toContain('registration.generate_proof');
    expect(suggestions).toContain('compliance.check_asset');
  });

  it('returns empty for terminal operations', () => {
    expect(suggestNextOperations('registration.generate_proof')).toEqual([]);
    expect(suggestNextOperations('compliance.generate_report')).toEqual([]);
  });

  it('suggests compliance check after trade execution', () => {
    expect(suggestNextOperations('trading.execute_trade')).toEqual([
      'compliance.check_transaction',
    ]);
  });
});
