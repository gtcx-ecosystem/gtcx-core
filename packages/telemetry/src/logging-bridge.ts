/**
 * Bridge from @gtcx/logging to telemetry-aware structured logs.
 *
 * Enriches log entries with trace context when available.
 */

import { createLogger, type LogLevel } from '@gtcx/logging';

import { getCurrentSpanContext } from './context';

export interface TelemetryLogger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
  fatal(message: string, data?: Record<string, unknown>): void;
  child(meta: Record<string, unknown>): TelemetryLogger;
}

export function createTelemetryLogger(
  service: string,
  meta: Record<string, unknown> = {}
): TelemetryLogger {
  const baseLogger = createLogger({ service });

  function log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    const spanContext = getCurrentSpanContext();
    const payload: Record<string, unknown> = {
      ...meta,
      ...data,
      ...(spanContext
        ? {
            traceId: spanContext.traceId,
            spanId: spanContext.spanId,
            parentSpanId: spanContext.parentSpanId,
          }
        : {}),
    };
    // Avoid union overload ambiguity on error/fatal signatures
    if (level === 'debug') baseLogger.debug(message, payload);
    else if (level === 'info') baseLogger.info(message, payload);
    else if (level === 'warn') baseLogger.warn(message, payload);
    else if (level === 'error') baseLogger.error(message, undefined, payload);
    else if (level === 'fatal') baseLogger.fatal(message, undefined, payload);
  }

  return {
    debug(message, data) {
      log('debug', message, data);
    },
    info(message, data) {
      log('info', message, data);
    },
    warn(message, data) {
      log('warn', message, data);
    },
    error(message, data) {
      log('error', message, data);
    },
    fatal(message, data) {
      log('fatal', message, data);
    },
    child(childMeta) {
      return createTelemetryLogger(service, { ...meta, ...childMeta });
    },
  };
}
