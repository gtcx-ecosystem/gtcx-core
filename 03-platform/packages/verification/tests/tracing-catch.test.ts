import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const SCRIPT_PATH = resolve(__dirname, 'helpers', 'test-tracing-catch.mjs');

describe('tracing.ts catch block — @gtcx/ai unavailable', () => {
  it('falls back to no-op implementations when @gtcx/ai is missing', () => {
    const result = spawnSync(process.execPath, [SCRIPT_PATH], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('fallback-ok');
    expect(result.stderr).toBe('');
  });
});
