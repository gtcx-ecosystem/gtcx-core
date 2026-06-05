#!/usr/bin/env node
/**
 * Child-process helper to test native-loader behavior in a clean module state.
 *
 * When GTCX_FORCE_JS_BACKEND is set, we trick native-loader into thinking
 * @gtcx/crypto-native is missing by deleting it from require.cache and
 * replacing require with a wrapper that throws for that module id.
 */

import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const action = process.argv[2];

// In a child process, we can manipulate the global require before importing
// the module-under-test.
const originalRequire = globalThis.require;

function mockRequire(id) {
  if (id === '@gtcx/crypto-native') {
    throw new Error('Module not found');
  }
  return originalRequire(id);
}

// Ensure require exists (we're in a Node CJS/ESM hybrid context)
if (typeof globalThis.require === 'function') {
  globalThis.require = mockRequire;
} else {
  const req = createRequire(import.meta.url);
  globalThis.require = function (id) {
    if (id === '@gtcx/crypto-native') {
      throw new Error('Module not found');
    }
    return req(id);
  };
}

try {
  // Import the module fresh in this process
  const { getBackend, getNativeCrypto } = await import(
    new URL('../../src/native-loader.ts', import.meta.url).href
  );

  if (action === 'getBackend') {
    console.log(getBackend());
    process.exit(0);
  }

  if (action === 'requireNative') {
    try {
      getNativeCrypto();
      console.error('Expected getNativeCrypto() to throw, but it did not');
      process.exit(1);
    } catch (err) {
      console.error(err.message);
      process.exit(1); // exit 1 so the test can assert stderr content
    }
  }

  console.error(`Unknown action: ${action}`);
  process.exit(1);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
