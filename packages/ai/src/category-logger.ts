/**
 * Category-scoped structured logger. Outputs JSON lines to stderr,
 * tagged with the category so downstream aggregators can filter.
 */

import { writeLog } from './writer';

export interface CategoryLogger {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
  debug(message: string, data?: Record<string, unknown>): void;
}

/**
 * Create a category-scoped logger that outputs structured JSON to stderr.
 */
export function createCategoryLogger(category: string): CategoryLogger {
  const emit = (level: string, message: string, data?: Record<string, unknown>): void => {
    writeLog(level, message, { category, ...data });
  };
  return {
    info: (msg, data) => emit('info', msg, data),
    warn: (msg, data) => emit('warn', msg, data),
    error: (msg, data) => emit('error', msg, data),
    debug: (msg, data) => emit('debug', msg, data),
  };
}
