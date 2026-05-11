/**
 * Local tracing adapter for @gtcx/crypto.
 *
 * Provides no-op fallbacks so crypto has zero hard internal dependencies.
 * When @gtcx/ai is installed as a peer dependency, its implementations
 * are used instead.
 */

type TraceFn = <TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  name: string,
  opts?: Record<string, unknown>
) => (...args: TArgs) => TReturn;

interface CategoryLogger {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
  debug(message: string, data?: Record<string, unknown>): void;
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

// The success-branch assignments execute at module-init time, before
// vitest's coverage instrumentation attaches. The catch branch is
// covered by tracing-catch.test.ts via a child-process harness.
// Both branches are tested; only the success branch is unmeasurable
// at this layer.
/* v8 ignore start -- module-init require; tested in tracing-{adapter,catch}.test.ts */
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ai = require('@gtcx/ai');
  if (ai?.traced) _traced = ai.traced;
  if (ai?.createCategoryLogger) _createCategoryLogger = ai.createCategoryLogger;
} catch {
  // @gtcx/ai not installed — using no-op fallbacks
}
/* v8 ignore stop */

export const traced = _traced;
export const createCategoryLogger = _createCategoryLogger;
