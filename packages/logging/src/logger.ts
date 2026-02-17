// ============================================================================
// Structured Logger Implementation
// ============================================================================

import { randomUUID } from 'node:crypto';

/**
 * Supported log levels in ascending order of severity.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Structured log entry produced by the logger.
 */
export interface LogEntry {
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Severity level */
  level: LogLevel;
  /** Human-readable log message */
  message: string;
  /** Service or module name */
  service: string;
  /** Optional correlation ID for tracing requests across services */
  correlationId?: string;
  /** Optional distributed trace ID */
  traceId?: string;
  /** Optional span ID within a trace */
  spanId?: string;
  /** Arbitrary structured data attached to the log entry */
  data?: Record<string, unknown>;
  /** Serialized error information */
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  /** Duration in milliseconds (for timed operations) */
  duration?: number;
}

/**
 * Configuration for creating a Logger instance.
 */
export interface LoggerConfig {
  /** Service or module name to include in every log entry */
  service: string;
  /** Minimum log level to output. Defaults to 'debug'. */
  level?: LogLevel;
  /** Correlation ID to include in every log entry */
  correlationId?: string;
  /** Custom output handler. Defaults to writing JSON to stdout/stderr. */
  output?: (entry: LogEntry) => void;
}

/**
 * Priority map for log levels. Higher number = higher severity.
 */
const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

/**
 * Default output handler that writes JSON to stdout (for debug/info/warn)
 * or stderr (for error/fatal).
 */
function defaultOutput(entry: LogEntry): void {
  const json = JSON.stringify(entry);
  if (entry.level === 'error' || entry.level === 'fatal') {
    process.stderr.write(json + '\n');
  } else {
    process.stdout.write(json + '\n');
  }
}

/**
 * Structured logger that produces JSON-formatted log entries.
 *
 * Supports log level filtering, correlation IDs, child loggers,
 * error serialization, and timed operations.
 */
export class Logger {
  private config: Required<LoggerConfig>;

  constructor(config: LoggerConfig) {
    this.config = {
      service: config.service,
      level: config.level ?? 'debug',
      correlationId: config.correlationId ?? '',
      output: config.output ?? defaultOutput,
    };
  }

  /**
   * Log a debug-level message.
   */
  debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, undefined, data);
  }

  /**
   * Log an info-level message.
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, undefined, data);
  }

  /**
   * Log a warn-level message.
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, undefined, data);
  }

  /**
   * Log an error-level message with an optional Error object.
   */
  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log('error', message, error, data);
  }

  /**
   * Log a fatal-level message with an optional Error object.
   */
  fatal(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log('fatal', message, error, data);
  }

  /**
   * Create a child logger that inherits the parent's configuration
   * with optional overrides. Useful for adding context (e.g., a
   * correlation ID or sub-service name) to a subset of log entries.
   */
  child(overrides: Partial<LoggerConfig>): Logger {
    return new Logger({
      service: overrides.service ?? this.config.service,
      level: overrides.level ?? this.config.level,
      correlationId: overrides.correlationId ?? this.config.correlationId,
      output: overrides.output ?? this.config.output,
    });
  }

  /**
   * Start a timer and return a function that, when called, returns
   * the elapsed duration in milliseconds. Useful for measuring
   * operation durations.
   *
   * @example
   * const elapsed = logger.startTimer();
   * await someOperation();
   * const duration = elapsed();
   * logger.info('Operation complete', { duration });
   */
  startTimer(): () => number {
    const start = Date.now();
    return () => Date.now() - start;
  }

  /**
   * Generate a unique correlation ID based on the current timestamp
   * and random hex characters. Useful for tracing requests across
   * service boundaries.
   */
  static generateCorrelationId(): string {
    return randomUUID();
  }

  /**
   * Internal method that constructs a LogEntry and dispatches it
   * to the configured output handler, respecting the minimum log level.
   */
  private log(
    level: LogLevel,
    message: string,
    error?: Error,
    data?: Record<string, unknown>
  ): void {
    // Filter out messages below the configured minimum level
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.config.level]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.config.service,
    };

    if (this.config.correlationId) {
      entry.correlationId = this.config.correlationId;
    }

    if (data) {
      entry.data = data;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    this.config.output(entry);
  }
}

/**
 * Factory function for creating a Logger instance.
 *
 * @example
 * const logger = createLogger({ service: 'api-gateway' });
 * logger.info('Server started', { port: 3000 });
 */
export function createLogger(config: LoggerConfig): Logger {
  return new Logger(config);
}
