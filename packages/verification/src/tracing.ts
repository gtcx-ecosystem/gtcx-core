/**
 * Local tracing adapter for @gtcx/verification.
 *
 * Provides no-op fallbacks so verification doesn't hard-depend on @gtcx/ai.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type TraceFn = <T extends (...args: any[]) => any>(
  fn: T,
  name: string,
  opts?: Record<string, unknown>
) => T;

type WithTraceFn = <T>(
  fn: (() => T) | ((...args: any[]) => any),
  operationName?: string,
  options?: Record<string, unknown>
) => T;

interface CategoryLogger {
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  debug(...args: any[]): void;
}

export interface OperationLog<TInput = any, TOutput = any> {
  operationName: string;
  type: string;
  category?: string;
  input?: TInput;
  output?: TOutput;
  duration?: number;
  durationMs?: number | null;
  timestamp: number;
  success?: boolean;
  error?: { name: string; message: string; stack?: string };
  metadata?: Record<string, unknown>;
}

type CreateCategoryLoggerFn = (category: string) => CategoryLogger;

const noopTraced: TraceFn = (fn) => fn;
const noopWithTrace: WithTraceFn = (fn) => fn() as any;
const noopLogger: CategoryLogger = { info() {}, warn() {}, error() {}, debug() {} };
const noopCreateCategoryLogger: CreateCategoryLoggerFn = () => noopLogger;

let _traced: TraceFn = noopTraced;
let _withTrace: WithTraceFn = noopWithTrace;
let _createCategoryLogger: CreateCategoryLoggerFn = noopCreateCategoryLogger;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ai = require('@gtcx/ai');
  if (ai?.traced) _traced = ai.traced;
  if (ai?.withTrace) _withTrace = ai.withTrace;
  if (ai?.createCategoryLogger) _createCategoryLogger = ai.createCategoryLogger;
} catch {
  // @gtcx/ai not installed — using no-op fallbacks
}

export const traced = _traced;
export const withTrace = _withTrace;
export const createCategoryLogger = _createCategoryLogger;
