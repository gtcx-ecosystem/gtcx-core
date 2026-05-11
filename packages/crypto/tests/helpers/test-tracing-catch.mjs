#!/usr/bin/env node
/**
 * Child-process helper to test tracing.ts fallback behavior.
 *
 * When @gtcx/ai is unavailable, tracing.ts should export no-op functions.
 */

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Replace global require with one that throws for @gtcx/ai
const originalRequire = globalThis.require;

function mockRequire(id) {
  if (id === '@gtcx/ai') {
    throw new Error('Module not found');
  }
  return originalRequire(id);
}

if (typeof globalThis.require === 'function') {
  globalThis.require = mockRequire;
} else {
  const req = createRequire(import.meta.url);
  globalThis.require = function (id) {
    if (id === '@gtcx/ai') {
      throw new Error('Module not found');
    }
    return req(id);
  };
}

try {
  const { traced, createCategoryLogger } = await import(
    new URL('../../src/tracing.ts', import.meta.url).href
  );

  // Verify all exports are defined and functional
  if (typeof traced !== 'function') {
    console.error('traced is not a function');
    process.exit(1);
  }
  if (typeof createCategoryLogger !== 'function') {
    console.error('createCategoryLogger is not a function');
    process.exit(1);
  }

  // Verify they are no-ops
  const wrapped = traced((x) => x + 1, 'test');
  if (wrapped(5) !== 6) {
    console.error('traced no-op did not preserve function behavior');
    process.exit(1);
  }

  const logger = createCategoryLogger('test');
  logger.info('test');
  logger.warn('test');
  logger.error('test');
  logger.debug('test');

  console.log('fallback-ok');
  process.exit(0);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
