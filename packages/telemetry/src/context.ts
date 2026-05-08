/**
 * Async-local trace context propagation.
 *
 * Uses AsyncLocalStorage (Node 20+) to carry SpanContext across async
 * boundaries without explicit parameter passing.
 */

import type { SpanContext } from './tracing';

interface AsyncLocalStorageType<T> {
  run<R>(store: T, callback: () => R): R;
  getStore(): T | undefined;
}

let als: AsyncLocalStorageType<SpanContext> | undefined;
let alsChecked = false;

function getALS(): AsyncLocalStorageType<SpanContext> | undefined {
  if (alsChecked) return als;
  alsChecked = true;
  try {
    // Dynamic import to avoid top-level require lint warning
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('node:async_hooks') as {
      AsyncLocalStorage: new <T>() => AsyncLocalStorageType<T>;
    };
    als = new mod.AsyncLocalStorage<SpanContext>();
    return als;
  } catch {
    return undefined;
  }
}

/**
 * Run a callback with the given span context in async local storage.
 */
export function runWithSpanContext<R>(context: SpanContext, callback: () => R): R {
  const storage = getALS();
  if (!storage) {
    // Fallback for environments without AsyncLocalStorage
    return callback();
  }
  return storage.run(context, callback);
}

/**
 * Get the current span context from async local storage, if any.
 */
export function getCurrentSpanContext(): SpanContext | undefined {
  const storage = getALS();
  if (!storage) return undefined;
  return storage.getStore();
}
