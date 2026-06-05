/**
 * Internal stderr JSON writer. Not exported from the package — the only
 * way structured records leave this module is through `createCategoryLogger`
 * (category-logger.ts) or via internal callers in `traced.ts` and
 * `span-emitter.ts`.
 */

export function writeLog(level: string, message: string, data?: Record<string, unknown>): void {
  const entry = JSON.stringify({
    level,
    msg: message,
    ...data,
    ts: new Date().toISOString(),
  });
  if (typeof process !== 'undefined' && process.stderr) {
    process.stderr.write(entry + '\n');
  }
}
