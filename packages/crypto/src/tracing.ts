/**
 * Local tracing adapter for @gtcx/crypto.
 *
 * Provides no-op fallbacks so crypto has zero hard internal dependencies.
 * When @gtcx/ai is installed as a peer dependency, its implementations
 * are used instead.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type TraceFn = <T extends (...args: any[]) => any>(
  fn: T,
  name: string,
  opts?: Record<string, unknown>
) => T;

interface CategoryLogger {
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  debug(...args: any[]): void;
}

type CreateCategoryLoggerFn = (category: string) => CategoryLogger;

// No-op defaults
const noopTraced: TraceFn = (fn) => fn;
const noopLogger: CategoryLogger = {
  info() {},
  warn() {},
  error() {},
  debug() {},
};
const noopCreateCategoryLogger: CreateCategoryLoggerFn = () => noopLogger;

let _traced: TraceFn = noopTraced;
let _createCategoryLogger: CreateCategoryLoggerFn = noopCreateCategoryLogger;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const ai = require('@gtcx/ai');
  if (ai?.traced) _traced = ai.traced;
  if (ai?.createCategoryLogger) _createCategoryLogger = ai.createCategoryLogger;
} catch {
  // @gtcx/ai not installed — using no-op fallbacks
}

export const traced = _traced;
export const createCategoryLogger = _createCategoryLogger;
