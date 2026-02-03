/**
 * @gtcx/security - Security Logger
 *
 * Structured security logging with P5 (AI-Native) support.
 * Implements P5 (AI-Native) and P12 (Observability) principles.
 *
 * @packageDocumentation
 */

import type { SecurityEvent, SecurityEventType, SecuritySeverity } from './events';
import { createSecurityEvent } from './events';

// =============================================================================
// LOGGER CONFIGURATION
// =============================================================================

export interface SecurityLoggerConfig {
  /** Minimum severity to log */
  minSeverity: SecuritySeverity;

  /** Include stack traces */
  includeStackTraces: boolean;

  /** Redact sensitive fields */
  redactSensitiveFields: boolean;
  sensitiveFields: string[];

  /** Batch configuration */
  batchSize: number;
  flushIntervalMs: number;

  /** Output as JSON */
  outputJson: boolean;
}

export const DEFAULT_LOGGER_CONFIG: SecurityLoggerConfig = {
  minSeverity: 'INFO',
  includeStackTraces: false,
  redactSensitiveFields: true,
  sensitiveFields: [
    'password',
    'secret',
    'token',
    'key',
    'privateKey',
    'apiKey',
    'credential',
    'pin',
    'ssn',
    'creditCard',
  ],
  batchSize: 100,
  flushIntervalMs: 5000,
  outputJson: true,
};

/**
 * Severity level ordering for comparison
 */
const SEVERITY_LEVELS: Record<SecuritySeverity, number> = {
  INFO: 0,
  WARN: 1,
  HIGH: 2,
  CRITICAL: 3,
};

// =============================================================================
// LOG HANDLER TYPE
// =============================================================================

/**
 * Handler function for security events
 * Implement this to send events to your logging infrastructure
 */
export type SecurityLogHandler = (event: SecurityEvent) => void | Promise<void>;

/**
 * Batch handler for multiple events
 */
export type SecurityBatchLogHandler = (events: SecurityEvent[]) => void | Promise<void>;

// =============================================================================
// SECURITY LOGGER
// =============================================================================

/**
 * Security logger with batching and structured output
 * 
 * @example
 * const logger = new SecurityLogger({ minSeverity: 'WARN' });
 * logger.addHandler(consoleLogHandler);
 * await logger.authSuccess('user-123', 'session-456');
 */
export class SecurityLogger {
  private config: SecurityLoggerConfig;
  private handlers: SecurityLogHandler[] = [];
  private batchHandlers: SecurityBatchLogHandler[] = [];
  private eventBuffer: SecurityEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: Partial<SecurityLoggerConfig> = {}) {
    this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };
  }

  /**
   * Register a log handler
   */
  addHandler(handler: SecurityLogHandler): void {
    this.handlers.push(handler);
  }

  /**
   * Register a batch log handler
   */
  addBatchHandler(handler: SecurityBatchLogHandler): void {
    this.batchHandlers.push(handler);
  }

  /**
   * Log a security event
   */
  async log(event: SecurityEvent): Promise<void> {
    // Check severity threshold
    if (!this.meetsMinSeverity(event.severity)) {
      return;
    }

    // Redact sensitive fields if configured
    const processedEvent = this.config.redactSensitiveFields
      ? this.redactEvent(event)
      : event;

    // Send to immediate handlers
    for (const handler of this.handlers) {
      try {
        await handler(processedEvent);
      } catch (error) {
        // Don't let handler errors break logging
        console.error('Security log handler error:', error);
      }
    }

    // Add to batch buffer
    if (this.batchHandlers.length > 0) {
      this.eventBuffer.push(processedEvent);

      // Flush if buffer is full
      if (this.eventBuffer.length >= this.config.batchSize) {
        await this.flush();
      } else {
        // Start flush timer if not already running
        this.startFlushTimer();
      }
    }
  }

  /**
   * Quick log method - creates event and logs it
   */
  async logEvent(
    eventType: SecurityEventType,
    outcome: SecurityEvent['outcome'],
    options?: Partial<Omit<SecurityEvent, 'timestamp' | 'eventType' | 'outcome'>>
  ): Promise<void> {
    const event = createSecurityEvent(eventType, outcome, options);
    await this.log(event);
  }

  /**
   * Flush batched events
   */
  async flush(): Promise<void> {
    if (this.eventBuffer.length === 0) {
      return;
    }

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    for (const handler of this.batchHandlers) {
      try {
        await handler(events);
      } catch (error) {
        console.error('Security batch log handler error:', error);
      }
    }
  }

  /**
   * Shutdown logger and flush remaining events
   */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }

  // ==========================================================================
  // CONVENIENCE METHODS
  // ==========================================================================

  /**
   * Log authentication success
   */
  async authSuccess(actorId: string, sessionId: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logEvent('AUTH_SUCCESS', 'SUCCESS', {
      actor: actorId,
      sessionId,
      metadata,
    });
  }

  /**
   * Log authentication failure
   */
  async authFailure(reason: string, actorId?: string, ip?: string): Promise<void> {
    await this.logEvent('AUTH_FAILURE', 'FAILURE', {
      actor: actorId,
      ip,
      reason,
    });
  }

  /**
   * Log access denied
   */
  async accessDenied(actorId: string, resource: string, action: string): Promise<void> {
    await this.logEvent('ACCESS_DENIED', 'BLOCKED', {
      actor: actorId,
      resource,
      action,
    });
  }

  /**
   * Log validation failure
   */
  async validationFailure(resource: string, reason: string, actorId?: string): Promise<void> {
    await this.logEvent('VALIDATION_FAILURE', 'FAILURE', {
      actor: actorId,
      resource,
      reason,
    });
  }

  /**
   * Log tamper detection
   */
  async tamperDetected(dataId: string, dataType: string, reason: string): Promise<void> {
    await this.logEvent('TAMPER_DETECTED', 'FAILURE', {
      resource: dataId,
      reason,
      severity: 'CRITICAL',
      metadata: { dataType },
    });
  }

  /**
   * Log security alert
   */
  async securityAlert(description: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logEvent('SECURITY_ALERT', 'FAILURE', {
      reason: description,
      metadata,
      severity: 'CRITICAL',
    });
  }

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  private meetsMinSeverity(severity: SecuritySeverity): boolean {
    return SEVERITY_LEVELS[severity] >= SEVERITY_LEVELS[this.config.minSeverity];
  }

  private redactEvent(event: SecurityEvent): SecurityEvent {
    const redacted = JSON.parse(JSON.stringify(event)) as SecurityEvent;

    // Redact sensitive fields in metadata
    if (redacted.metadata) {
      redacted.metadata = this.redactObject(redacted.metadata);
    }

    return redacted;
  }

  private redactObject(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = this.config.sensitiveFields.some(
        (field) => lowerKey.includes(field.toLowerCase())
      );

      if (isSensitive) {
        result[key] = '[REDACTED]';
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.redactObject(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      return;
    }

    this.flushTimer = setInterval(() => {
      this.flush().catch((error) => {
        console.error('Security log flush error:', error);
      });
    }, this.config.flushIntervalMs);
  }
}

// =============================================================================
// DEFAULT LOG HANDLERS
// =============================================================================

/**
 * Console log handler for development
 */
export function consoleLogHandler(event: SecurityEvent): void {
  const prefix = `[SECURITY:${event.severity}]`;
  const message = `${prefix} ${event.eventType} - ${event.outcome}`;

  switch (event.severity) {
    case 'CRITICAL':
      console.error(message, event);
      break;
    case 'HIGH':
      console.warn(message, event);
      break;
    case 'WARN':
      console.warn(message, event);
      break;
    default:
      console.log(message, event);
  }
}

/**
 * JSON log handler for production (structured logging)
 */
export function jsonLogHandler(event: SecurityEvent): void {
  console.log(JSON.stringify(event));
}
