import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const SCRIPT_PATH = resolve(__dirname, 'helpers', 'test-native-unavailable.mjs');

describe('crypto backend selection — native unavailable (child process)', () => {
  it('defaults to js when native bindings are unavailable', () => {
    const result = spawnSync(process.execPath, [SCRIPT_PATH, 'getBackend'], {
      env: {
        ...process.env,
        GTCX_FORCE_JS_BACKEND: '1',
      },
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('js');
    expect(result.stderr).toBe('');
  });

  it('throws when GTCX_REQUIRE_NATIVE=true and native bindings unavailable', () => {
    const result = spawnSync(process.execPath, [SCRIPT_PATH, 'requireNative'], {
      env: {
        ...process.env,
        GTCX_FORCE_JS_BACKEND: '1',
        GTCX_REQUIRE_NATIVE: 'true',
      },
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Native crypto bindings are required but could not be loaded.');
  });
});
