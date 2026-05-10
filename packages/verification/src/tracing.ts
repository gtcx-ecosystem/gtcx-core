/**
 * Local tracing adapter for @gtcx/verification.
 *
 * Provides no-op fallbacks so verification doesn't hard-depend on @gtcx/ai.
 */

type TraceFn = <TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  name: string,
  opts?: Record<string, unknown>
) => (...args: TArgs) => TReturn;

type WithTraceFn = <T>(fn: () => T, operationName?: string, options?: Record<string, unknown>) => T;

interface CategoryLogger {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
  debug(message: string, data?: Record<string, unknown>): void;
}

export interface OperationLog<TInput = unknown, TOutput = unknown> {
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
const noopWithTrace: WithTraceFn = <T>(fn: () => T) => fn();
const noopLogger: CategoryLogger = { info() {}, warn() {}, error() {}, debug() {} };
const noopCreateCategoryLogger: CreateCategoryLoggerFn = () => noopLogger;

let _traced: TraceFn = noopTraced;
let _withTrace: WithTraceFn = noopWithTrace;
let _createCategoryLogger: CreateCategoryLoggerFn = noopCreateCategoryLogger;

// The success-branch assignments below execute at module-init time, before
// vitest's coverage instrumentation attaches. The lines run in production
// (verified by `tracing-adapter.test.ts` observing the @gtcx/ai JSON
// output format) but v8 coverage can't measure them. The catch branch is
// covered by `tracing-catch.test.ts` via a child-process harness that
// fakes the require failure. Both branches are tested; only the success
// branch is unmeasurable at this layer.
/* v8 ignore start -- module-init require; both branches tested in tracing-{adapter,catch}.test.ts */
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ai = require('@gtcx/ai');
  if (ai?.traced) _traced = ai.traced;
  if (ai?.withTrace) _withTrace = ai.withTrace;
  if (ai?.createCategoryLogger) _createCategoryLogger = ai.createCategoryLogger;
} catch {
  // @gtcx/ai not installed — using no-op fallbacks
}
/* v8 ignore stop */

export const traced = _traced;
export const withTrace = _withTrace;
export const createCategoryLogger = _createCategoryLogger;
