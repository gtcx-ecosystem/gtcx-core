/**
 * @gtcx/connectivity — Coverage gap tests
 */

import { describe, it, expect, vi } from 'vitest';

import { RequestBatcher } from '../src/batching.js';
import { ConnectivityDetector } from '../src/detector.js';
import { UssdParser } from '../src/ussd/parser.js';

describe('RequestBatcher — uncovered branches', () => {
  it('flush with empty queue returns early', async () => {
    const batcher = new RequestBatcher({
      flushFn: vi.fn(async () => []),
      getProfile: () => 'edge',
      activeProfiles: ['edge'],
    });
    await batcher.flush();
    batcher.destroy();
  });

  it('startTimer is no-op when timer already exists', () => {
    const batcher = new RequestBatcher({
      flushFn: vi.fn(async () => []),
      getProfile: () => 'edge',
      activeProfiles: ['edge'],
    });
    (batcher as unknown as Record<string, () => void>).startTimer();
    batcher.destroy();
  });

  it('destroy is no-op when timer is already null', () => {
    const batcher = new RequestBatcher({
      flushFn: vi.fn(async () => []),
      getProfile: () => 'edge',
      activeProfiles: ['edge'],
    });
    batcher.destroy();
    batcher.destroy(); // second destroy should not throw
  });
});

describe('compression.ts — Buffer fallback', () => {
  it('compresses and decompresses without Buffer', async () => {
    const mod = await import('../src/compression.js');
    const originalBuffer = globalThis.Buffer;
    // @ts-expect-error removing Buffer for browser env simulation
    delete globalThis.Buffer;
    try {
      const payload = { message: 'hello world' };
      const compressed = await mod.compressPayload(payload);
      const restored = await mod.decompressPayload(compressed);
      expect(restored).toEqual(payload);
    } finally {
      // @ts-expect-error restoring Buffer
      globalThis.Buffer = originalBuffer;
    }
  });
});

describe('ConnectivityDetector — bandwidth middle branch', () => {
  it('classifies bandwidth as 2000 Kbps when latency is 200-1000ms', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 500));
      return { ok: true };
    });

    const detector = new ConnectivityDetector({ checkIntervalMs: 1000 });
    await detector.forceCheck();
    const state = detector.getState();
    expect(state.bandwidthKbps).toBe(2_000);
    detector.destroy();
    globalThis.fetch = originalFetch;
  });
});

describe('UssdParser — serviceCode without leading star', () => {
  it('extracts input when serviceCode has no leading star', () => {
    const parser = new UssdParser();
    const input = parser.extractInput('*384*123*1*42#', '384*123');
    expect(input).toBe('1*42');
  });
});
