/**
 * AI Operation Logging
 *
 * Structured logging for AI-assisted operations and analysis.
 * Implements P5 (AI-Native) principle.
 *
 */

import { randomUUID } from 'node:crypto';

// ============================================================================
// OPERATION TYPES
// ============================================================================

export type OperationType =
  | 'registration.validate'
  | 'registration.register'
  | 'registration.generate_proof'
  | 'trading.calculate_price'
  | 'trading.find_opportunities'
  | 'trading.execute_trade'
  | 'compliance.check_asset'
  | 'compliance.check_transaction'
  | 'compliance.generate_report';

export type OperationStatus = 'started' | 'success' | 'failed' | 'skipped';

// ============================================================================
// OPERATION LOG ENTRY
// ============================================================================

export interface OperationLogEntry {
  /** Unique operation ID */
  operationId: string;
  /** Operation type */
  type: OperationType;
  /** Current status */
  status: OperationStatus;
  /** Start timestamp (ms) */
  startTime: number;
  /** End timestamp (ms) */
  endTime?: number;
  /** Duration (ms) */
  duration?: number;
  /** Input summary (sanitized, no PII) */
  input?: Record<string, unknown>;
  /** Output summary */
  output?: Record<string, unknown>;
  /** Error details if failed */
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
  /** Parent operation ID for nested operations */
  parentId?: string;
  /** Correlation ID for distributed tracing */
  correlationId?: string;
  /** Tags for filtering */
  tags?: string[];
  /** AI analysis hints */
  aiContext?: {
    /** Suggested follow-up operations */
    suggestedNextOps?: OperationType[];
    /** Anomaly indicators */
    anomalies?: string[];
    /** Pattern matches */
    patterns?: string[];
    /** Confidence score (0-1) */
    confidence?: number;
  };
}

// ============================================================================
// OPERATION LOGGER INTERFACE
// ============================================================================

export interface IOperationLogger {
  /**
   * Start a new operation
   * @returns Operation ID
   */
  start(
    type: OperationType,
    input?: Record<string, unknown>,
    options?: {
      parentId?: string;
      correlationId?: string;
      tags?: string[];
    }
  ): string;

  /**
   * Mark operation as successful
   */
  success(
    operationId: string,
    output?: Record<string, unknown>,
    aiContext?: OperationLogEntry['aiContext']
  ): void;

  /**
   * Mark operation as failed
   */
  fail(operationId: string, error: Error | string, errorCode?: string): void;

  /**
   * Mark operation as skipped
   */
  skip(operationId: string, reason: string): void;

  /**
   * Add tags to an operation
   */
  addTags(operationId: string, tags: string[]): void;

  /**
   * Get operation entry
   */
  get(operationId: string): OperationLogEntry | undefined;

  /**
   * Get all operations for a correlation ID
   */
  getByCorrelationId(correlationId: string): OperationLogEntry[];
}

// ============================================================================
// IN-MEMORY OPERATION LOGGER
// ============================================================================

export class InMemoryOperationLogger implements IOperationLogger {
  private operations: Map<string, OperationLogEntry> = new Map();
  private maxEntries: number;

  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries;
  }

  start(
    type: OperationType,
    input?: Record<string, unknown>,
    options?: {
      parentId?: string;
      correlationId?: string;
      tags?: string[];
    }
  ): string {
    const operationId = this.generateId();

    const entry: OperationLogEntry = {
      operationId,
      type,
      status: 'started',
      startTime: Date.now(),
      input: input ? this.sanitizeInput(input) : undefined,
      parentId: options?.parentId,
      correlationId: options?.correlationId,
      tags: options?.tags,
    };

    this.operations.set(operationId, entry);
    this.pruneIfNeeded();

    return operationId;
  }

  success(
    operationId: string,
    output?: Record<string, unknown>,
    aiContext?: OperationLogEntry['aiContext']
  ): void {
    const entry = this.operations.get(operationId);
    if (!entry) return;

    entry.status = 'success';
    entry.endTime = Date.now();
    entry.duration = entry.endTime - entry.startTime;
    entry.output = output;
    entry.aiContext = aiContext;
  }

  fail(operationId: string, error: Error | string, errorCode?: string): void {
    const entry = this.operations.get(operationId);
    if (!entry) return;

    entry.status = 'failed';
    entry.endTime = Date.now();
    entry.duration = entry.endTime - entry.startTime;
    entry.error = {
      message: error instanceof Error ? error.message : error,
      code: errorCode,
      stack: error instanceof Error ? error.stack : undefined,
    };
  }

  skip(operationId: string, reason: string): void {
    const entry = this.operations.get(operationId);
    if (!entry) return;

    entry.status = 'skipped';
    entry.endTime = Date.now();
    entry.duration = entry.endTime - entry.startTime;
    entry.output = { skipReason: reason };
  }

  addTags(operationId: string, tags: string[]): void {
    const entry = this.operations.get(operationId);
    if (!entry) return;

    entry.tags = [...(entry.tags || []), ...tags];
  }

  get(operationId: string): OperationLogEntry | undefined {
    return this.operations.get(operationId);
  }

  getByCorrelationId(correlationId: string): OperationLogEntry[] {
    const results: OperationLogEntry[] = [];
    this.operations.forEach((entry) => {
      if (entry.correlationId === correlationId) {
        results.push(entry);
      }
    });
    return results.sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * Get all operations (for testing/debugging)
   */
  getAll(): OperationLogEntry[] {
    return Array.from(this.operations.values());
  }

  /**
   * Get operations by type
   */
  getByType(type: OperationType): OperationLogEntry[] {
    return Array.from(this.operations.values()).filter((e) => e.type === type);
  }

  /**
   * Get failed operations
   */
  getFailed(): OperationLogEntry[] {
    return Array.from(this.operations.values()).filter((e) => e.status === 'failed');
  }

  /**
   * Get operations with anomalies
   */
  getAnomalies(): OperationLogEntry[] {
    return Array.from(this.operations.values()).filter(
      (e) => e.aiContext?.anomalies && e.aiContext.anomalies.length > 0
    );
  }

  /**
   * Clear all operations
   */
  clear(): void {
    this.operations.clear();
  }

  /**
   * Generate unique operation ID
   */
  private generateId(): string {
    return `op_${randomUUID()}`;
  }

  /**
   * Sanitize input to remove PII
   */
  private sanitizeInput(input: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    const piiKeys = ['name', 'email', 'phone', 'address', 'ssn', 'passport', 'license'];

    for (const [key, value] of Object.entries(input)) {
      if (piiKeys.some((pii) => key.toLowerCase().includes(pii))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = Array.isArray(value) ? `[Array(${value.length})]` : '[Object]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Remove oldest entries if over limit
   */
  private pruneIfNeeded(): void {
    if (this.operations.size <= this.maxEntries) return;

    const entries = Array.from(this.operations.entries()).sort(
      (a, b) => a[1].startTime - b[1].startTime
    );

    const toRemove = entries.slice(0, entries.length - this.maxEntries);
    toRemove.forEach(([id]) => this.operations.delete(id));
  }
}

// ============================================================================
// NULL LOGGER (when logging not needed)
// ============================================================================

export const nullOperationLogger: IOperationLogger = {
  start: () => 'null',
  success: () => {},
  fail: () => {},
  skip: () => {},
  addTags: () => {},
  get: () => undefined,
  getByCorrelationId: () => [],
};

// ============================================================================
// AI ANALYSIS HELPERS
// ============================================================================

/**
 * Detect anomalies in operation metrics
 */
export function detectAnomalies(
  entry: OperationLogEntry,
  thresholds: {
    maxDuration?: number;
    maxInputSize?: number;
  } = {}
): string[] {
  const anomalies: string[] = [];

  const { maxDuration = 5000, maxInputSize = 100 } = thresholds;

  if (entry.duration && entry.duration > maxDuration) {
    anomalies.push(`Slow operation: ${entry.duration}ms > ${maxDuration}ms threshold`);
  }

  if (entry.input && Object.keys(entry.input).length > maxInputSize) {
    anomalies.push(`Large input: ${Object.keys(entry.input).length} keys`);
  }

  return anomalies;
}

/**
 * Suggest next operations based on current operation
 */
export function suggestNextOperations(type: OperationType): OperationType[] {
  const suggestions: Record<OperationType, OperationType[]> = {
    'registration.validate': ['registration.register'],
    'registration.register': ['registration.generate_proof', 'compliance.check_asset'],
    'registration.generate_proof': [],
    'trading.calculate_price': ['trading.find_opportunities'],
    'trading.find_opportunities': ['trading.execute_trade'],
    'trading.execute_trade': ['compliance.check_transaction'],
    'compliance.check_asset': ['trading.calculate_price'],
    'compliance.check_transaction': ['compliance.generate_report'],
    'compliance.generate_report': [],
  };

  return suggestions[type] || [];
}
