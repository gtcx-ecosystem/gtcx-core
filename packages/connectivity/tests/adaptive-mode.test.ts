import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { createAdaptiveMode } from '../src/adaptive-mode.js';
import { RequestBatcher } from '../src/batching.js';
import type { BatchFlushFn } from '../src/batching.js';
import { shouldCompress, compressPayload, decompressPayload } from '../src/compression.js';
import { ConnectivityDetector } from '../src/detector.js';
import { shouldDownsample, downsampleConfig } from '../src/images.js';
import type { ConnectivityProfile } from '../src/types.js';

const LOW_BANDWIDTH_PROFILES: ConnectivityProfile[] = ['edge', 'ussd-only', 'satellite'];

describe('shouldCompress', () => {
  it('returns true for edge, ussd-only, and satellite', () => {
    for (const profile of LOW_BANDWIDTH_PROFILES) {
      expect(shouldCompress(profile)).toBe(true);
    }
  });

  it('returns false for offline, degraded, and standard', () => {
    const inactive: ConnectivityProfile[] = ['offline', 'degraded', 'standard'];
    for (const profile of inactive) {
      expect(shouldCompress(profile)).toBe(false);
    }
  });
});

describe('compressPayload / decompressPayload', () => {
  const originalCompressionStream = globalThis.CompressionStream;
  const originalDecompressionStream = globalThis.DecompressionStream;

  afterEach(() => {
    globalThis.CompressionStream = originalCompressionStream;
    globalThis.DecompressionStream = originalDecompressionStream;
  });

  it('round-trips an object using gzip when CompressionStream is available', async () => {
    const data = { foo: 'bar', nums: [1, 2, 3] };
    const compressed = await compressPayload(data);
    expect(compressed.format).toBe('gzip');
    expect(compressed.originalSize).toBeGreaterThan(0);
    expect(compressed.data.length).toBeGreaterThan(0);

    const decompressed = await decompressPayload(compressed);
    expect(decompressed).toEqual(data);
  });

  it('round-trips using json fallback when CompressionStream is unavailable', async () => {
    // @ts-expect-error intentional removal for test
    delete globalThis.CompressionStream;
    // @ts-expect-error intentional removal for test
    delete globalThis.DecompressionStream;

    const data = { hello: 'world' };
    const compressed = await compressPayload(data);
    expect(compressed.format).toBe('json');

    const decompressed = await decompressPayload(compressed);
    expect(decompressed).toEqual(data);
  });

  it('decompresses none format as raw string', async () => {
    const payload = { format: 'none' as const, data: 'plain text', originalSize: 10 };
    const result = await decompressPayload(payload);
    expect(result).toBe('plain text');
  });
});

describe('shouldDownsample', () => {
  it('returns true for edge, ussd-only, and satellite', () => {
    for (const profile of LOW_BANDWIDTH_PROFILES) {
      expect(shouldDownsample(profile)).toBe(true);
    }
  });

  it('returns false for offline, degraded, and standard', () => {
    const inactive: ConnectivityProfile[] = ['offline', 'degraded', 'standard'];
    for (const profile of inactive) {
      expect(shouldDownsample(profile)).toBe(false);
    }
  });
});

describe('downsampleConfig', () => {
  it('returns edge config', () => {
    const cfg = downsampleConfig('edge');
    expect(cfg).toEqual({ maxWidth: 640, maxHeight: 480, quality: 0.6, format: 'jpeg' });
  });

  it('returns ussd-only config', () => {
    const cfg = downsampleConfig('ussd-only');
    expect(cfg).toEqual({ maxWidth: 320, maxHeight: 240, quality: 0.4, format: 'jpeg' });
  });

  it('returns satellite config', () => {
    const cfg = downsampleConfig('satellite');
    expect(cfg).toEqual({ maxWidth: 480, maxHeight: 360, quality: 0.5, format: 'jpeg' });
  });

  it('returns unbounded config for other profiles', () => {
    const others: ConnectivityProfile[] = ['offline', 'degraded', 'standard'];
    for (const profile of others) {
      const cfg = downsampleConfig(profile);
      expect(cfg.maxWidth).toBe(Number.POSITIVE_INFINITY);
      expect(cfg.maxHeight).toBe(Number.POSITIVE_INFINITY);
      expect(cfg.quality).toBe(1.0);
      expect(cfg.format).toBe('jpeg');
    }
  });
});

describe('RequestBatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const makeFlushFn = (): BatchFlushFn & { calls: BatchFlushFn[] } => {
    const calls: BatchFlushFn[] = [];
    const fn: BatchFlushFn = async (requests) => {
      calls.push(requests);
      return requests.map((r) => ({ id: r.id, result: { ok: true } }));
    };
    // @ts-expect-error attaching metadata
    fn.calls = calls;
    return fn as BatchFlushFn & { calls: BatchFlushFn[] };
  };

  it('passes through immediately for standard profile', async () => {
    const flushFn = makeFlushFn();
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'standard',
    });

    const response = await batcher.add({ payload: { test: 1 } });
    expect(response.result).toEqual({ ok: true });
    expect(flushFn.calls.length).toBe(1);
    expect(flushFn.calls[0].length).toBe(1);

    batcher.destroy();
  });

  it('passes through immediately for degraded profile', async () => {
    const flushFn = makeFlushFn();
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'degraded',
    });

    await batcher.add({ payload: { test: 2 } });
    expect(flushFn.calls.length).toBe(1);
    batcher.destroy();
  });

  it('queues requests for edge profile', async () => {
    const flushFn = makeFlushFn();
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'edge',
      flushIntervalMs: 10_000,
    });

    const p1 = batcher.add({ payload: { test: 1 } });
    const p2 = batcher.add({ payload: { test: 2 } });

    expect(flushFn.calls.length).toBe(0);

    await batcher.flush();

    const r1 = await p1;
    const r2 = await p2;
    expect(r1.result).toEqual({ ok: true });
    expect(r2.result).toEqual({ ok: true });
    expect(flushFn.calls.length).toBe(1);
    expect(flushFn.calls[0].length).toBe(2);

    batcher.destroy();
  });

  it('auto-flushes when queue reaches maxBatchSize', async () => {
    const flushFn = makeFlushFn();
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'satellite',
      maxBatchSize: 3,
      flushIntervalMs: 60_000,
    });

    const promises = [
      batcher.add({ payload: 1 }),
      batcher.add({ payload: 2 }),
      batcher.add({ payload: 3 }),
    ];

    // Should have auto-flushed on the 3rd add
    expect(flushFn.calls.length).toBe(1);
    expect(flushFn.calls[0].length).toBe(3);

    const responses = await Promise.all(promises);
    expect(responses.every((r) => r.result)).toBe(true);

    batcher.destroy();
  });

  it('auto-flushes on timer', async () => {
    const flushFn = makeFlushFn();
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'ussd-only',
      maxBatchSize: 100,
      flushIntervalMs: 5_000,
    });

    const p = batcher.add({ payload: 'delayed' });
    expect(flushFn.calls.length).toBe(0);

    await vi.advanceTimersByTimeAsync(5_000);

    const response = await p;
    expect(response.result).toEqual({ ok: true });
    expect(flushFn.calls.length).toBe(1);

    batcher.destroy();
  });

  it('rejects pending requests when flush fails', async () => {
    const batcher = new RequestBatcher({
      flushFn: async () => {
        throw new Error('network error');
      },
      getProfile: () => 'edge',
      flushIntervalMs: 60_000,
    });

    const p = batcher.add({ payload: 'x' });
    await batcher.flush();

    await expect(p).rejects.toThrow('network error');
    batcher.destroy();
  });

  it('reject unmatched responses after flush', async () => {
    const batcher = new RequestBatcher({
      flushFn: async (requests) => {
        // Return only half the responses
        return requests.slice(0, 1).map((r) => ({ id: r.id, result: 'ok' }));
      },
      getProfile: () => 'edge',
      flushIntervalMs: 60_000,
    });

    const p1 = batcher.add({ payload: 'a' });
    const p2 = batcher.add({ payload: 'b' });
    await batcher.flush();

    // One resolves, the other rejects because it was missing from the response
    await expect(p1).resolves.toBeDefined();
    await expect(p2).rejects.toThrow('not resolved by flush');
    batcher.destroy();
  });

  it('destroy rejects all pending and stops timer', async () => {
    const flushFn = makeFlushFn();
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'edge',
      flushIntervalMs: 1_000,
    });

    const p = batcher.add({ payload: 'x' });
    batcher.destroy();

    await expect(p).rejects.toThrow('Batcher destroyed');
  });
});

describe('createAdaptiveMode', () => {
  it('exposes the current profile', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true);
    const mode = createAdaptiveMode(detector);
    expect(mode.profile).toBe('standard');
    detector.destroy();
  });

  it('compression reflects current profile', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true); // standard
    const mode = createAdaptiveMode(detector);

    expect(mode.compression.shouldCompress()).toBe(false);

    detector.setOnline(false); // offline
    expect(mode.compression.shouldCompress()).toBe(false);
    detector.destroy();
  });

  it('images reflects current profile', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true); // standard
    const mode = createAdaptiveMode(detector);

    expect(mode.images.shouldDownsample()).toBe(false);
    const cfg = mode.images.downsampleConfig();
    expect(cfg.maxWidth).toBe(Number.POSITIVE_INFINITY);

    detector.destroy();
  });

  it('batching reflects current profile', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true); // standard
    const mode = createAdaptiveMode(detector);

    expect(mode.batching.isActive()).toBe(false);
    detector.destroy();
  });

  it('orchestrates all three correctly for satellite', async () => {
    const flushFn = vi.fn(async (reqs: import('../src/batching.js').BatchRequest[]) =>
      reqs.map((r) => ({ id: r.id, result: { ok: true } }))
    );

    const detector = new ConnectivityDetector();
    detector.setOnline(true);
    // Force profile to satellite by using a custom check
    createAdaptiveMode(detector, {
      batchFlushFn: flushFn,
      batchingMaxSize: 5,
      batchingFlushIntervalMs: 10_000,
    });

    // Manually override detector state to satellite via setOnline(false) then setOnline(true)
    // won't give satellite, but we can test the batcher isActive with a custom detector
    // Let's create a detector that reports satellite
    const satelliteDetector = new ConnectivityDetector({
      checkFn: async () => ({
        online: true,
        latencyMs: 600,
        bandwidthKbps: 100,
      }),
    });
    await satelliteDetector.forceCheck();
    expect(satelliteDetector.getState().profile).toBe('satellite');

    const satelliteMode = createAdaptiveMode(satelliteDetector, {
      batchFlushFn: flushFn,
      batchingMaxSize: 5,
      batchingFlushIntervalMs: 10_000,
    });

    expect(satelliteMode.compression.shouldCompress()).toBe(true);
    expect(satelliteMode.images.shouldDownsample()).toBe(true);
    expect(satelliteMode.images.downsampleConfig()).toEqual({
      maxWidth: 480,
      maxHeight: 360,
      quality: 0.5,
      format: 'jpeg',
    });
    expect(satelliteMode.batching.isActive()).toBe(true);

    // Batch a request
    const promise = satelliteMode.batching.batcher.add({ payload: { test: 1 } });
    await satelliteMode.batching.batcher.flush();
    const response = await promise;
    expect(response.result).toEqual({ ok: true });

    satelliteDetector.destroy();
    detector.destroy();
  });

  it('policy-driven config overrides defaults', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true); // standard

    const mode = createAdaptiveMode(detector, {
      compressionProfiles: ['standard'],
      imageProfiles: ['standard'],
      batchingProfiles: ['standard'],
    });

    expect(mode.compression.shouldCompress()).toBe(true);
    expect(mode.images.shouldDownsample()).toBe(true);
    expect(mode.batching.isActive()).toBe(true);

    detector.destroy();
  });

  it('policy can disable all features with empty arrays', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true); // standard

    const mode = createAdaptiveMode(detector, {
      compressionProfiles: [],
      imageProfiles: [],
      batchingProfiles: [],
    });

    expect(mode.compression.shouldCompress()).toBe(false);
    expect(mode.images.shouldDownsample()).toBe(false);
    expect(mode.batching.isActive()).toBe(false);

    detector.destroy();
  });
});
