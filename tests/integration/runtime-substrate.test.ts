/**
 * Integration: @gtcx/runtime substrate wires client, connectivity, telemetry.
 */
import { createRuntime } from '@gtcx/runtime';
import { describe, it, expect, afterEach } from 'vitest';

describe('Runtime substrate integration', () => {
  let runtime: ReturnType<typeof createRuntime> | undefined;

  afterEach(() => {
    runtime?.destroy();
    runtime = undefined;
  });

  it('createRuntime(edge) exposes client and connectivity with test fetcher', async () => {
    const calls: string[] = [];
    runtime = createRuntime({
      baseUrl: 'https://api.example.test',
      deployment: 'edge',
      telemetry: 'none',
      fetcher: async (input) => {
        calls.push(String(input));
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      },
    });

    expect(runtime.client).toBeDefined();
    expect(runtime.connectivity).toBeDefined();
    expect(runtime.metrics).toBeDefined();

    await runtime.client.get('/health');
    expect(calls.some((url) => url.includes('api.example.test'))).toBe(true);
  });
});
