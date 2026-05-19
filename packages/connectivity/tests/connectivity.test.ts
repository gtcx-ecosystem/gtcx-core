import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { ConnectivityDetector } from '../src/detector.js';
import { classifyProfile } from '../src/profiles.js';
import type { ConnectivityCheckFn } from '../src/types.js';

describe('defaultCheckFn', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.GTCX_HEALTH_URL;
  });

  it('returns online when fetch succeeds', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
    });

    const detector = new ConnectivityDetector({ checkIntervalMs: 1000 });
    await detector.forceCheck();
    const state = detector.getState();
    expect(state.online).toBe(true);
    detector.destroy();
  });

  it('returns offline when fetch throws', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network unreachable'));

    const detector = new ConnectivityDetector({ checkIntervalMs: 1000, offlineThresholdMs: 0 });
    await detector.forceCheck();
    const state = detector.getState();
    expect(state.online).toBe(false);
    detector.destroy();
  });

  it('classifies bandwidth as 500 Kbps when default check latency >= 1000ms', async () => {
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 1200));
      return { ok: true };
    });

    const detector = new ConnectivityDetector({ checkIntervalMs: 1000 });
    await detector.forceCheck();
    const state = detector.getState();
    expect(state.bandwidthKbps).toBe(500);
    detector.destroy();
  });

  it('uses GTCX_HEALTH_URL env var when set', async () => {
    process.env.GTCX_HEALTH_URL = 'https://custom.example.com/health';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock;

    const detector = new ConnectivityDetector({ checkIntervalMs: 1000 });
    await detector.forceCheck();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://custom.example.com/health',
      expect.objectContaining({ method: 'HEAD' })
    );
    detector.destroy();
  });
});

describe('classifyProfile', () => {
  it('returns offline when bandwidth is 0', () => {
    expect(classifyProfile(0, 100)).toBe('offline');
  });

  it('returns offline when bandwidth is negative', () => {
    expect(classifyProfile(-1, 100)).toBe('offline');
  });

  it('returns ussd-only when bandwidth < 1 Kbps', () => {
    expect(classifyProfile(0.5, 100)).toBe('ussd-only');
    expect(classifyProfile(0.99, 300)).toBe('ussd-only');
  });

  it('returns satellite when bandwidth < 512 Kbps and latency > 500ms', () => {
    expect(classifyProfile(100, 600)).toBe('satellite');
    expect(classifyProfile(511, 501)).toBe('satellite');
  });

  it('returns edge when bandwidth < 200 Kbps (not satellite)', () => {
    expect(classifyProfile(1, 100)).toBe('edge');
    expect(classifyProfile(100, 200)).toBe('edge');
    expect(classifyProfile(199, 400)).toBe('edge');
  });

  it('returns standard when bandwidth > 5 Mbps and latency < 200ms', () => {
    expect(classifyProfile(5001, 100)).toBe('standard');
    expect(classifyProfile(10000, 50)).toBe('standard');
    expect(classifyProfile(50000, 199)).toBe('standard');
  });

  it('returns degraded for moderate bandwidth', () => {
    expect(classifyProfile(1000, 100)).toBe('degraded');
    expect(classifyProfile(3000, 150)).toBe('degraded');
    expect(classifyProfile(5000, 100)).toBe('degraded');
  });

  it('returns degraded for high bandwidth with high latency', () => {
    expect(classifyProfile(10000, 300)).toBe('degraded');
    expect(classifyProfile(6000, 200)).toBe('degraded');
  });

  // Boundary values
  it('boundary: bandwidth exactly 1 Kbps is edge (not ussd-only)', () => {
    expect(classifyProfile(1, 100)).toBe('edge');
  });

  it('boundary: bandwidth exactly 200 Kbps is degraded (not edge)', () => {
    expect(classifyProfile(200, 100)).toBe('degraded');
  });

  it('boundary: bandwidth exactly 512 Kbps with high latency is degraded (not satellite)', () => {
    expect(classifyProfile(512, 600)).toBe('degraded');
  });

  it('boundary: bandwidth exactly 5000 Kbps with low latency is degraded (not standard)', () => {
    expect(classifyProfile(5000, 100)).toBe('degraded');
  });

  it('boundary: latency exactly 500ms with low bandwidth is edge (not satellite)', () => {
    expect(classifyProfile(100, 500)).toBe('edge');
  });

  it('boundary: latency exactly 200ms with high bandwidth is degraded (not standard)', () => {
    expect(classifyProfile(6000, 200)).toBe('degraded');
  });
});

describe('ConnectivityDetector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('has default state of online/standard', () => {
    const detector = new ConnectivityDetector();
    const state = detector.getState();
    expect(state.online).toBe(true);
    expect(state.profile).toBe('standard');
    expect(state.lastChecked).toBeTypeOf('number');
    detector.destroy();
  });

  it('returns a copy of state from getState', () => {
    const detector = new ConnectivityDetector();
    const s1 = detector.getState();
    const s2 = detector.getState();
    expect(s1).toEqual(s2);
    expect(s1).not.toBe(s2);
    detector.destroy();
  });

  describe('manual override with setOnline', () => {
    it('sets offline state', () => {
      const detector = new ConnectivityDetector();
      detector.setOnline(false);
      const state = detector.getState();
      expect(state.online).toBe(false);
      expect(state.profile).toBe('offline');
      detector.destroy();
    });

    it('sets online state', () => {
      const detector = new ConnectivityDetector();
      detector.setOnline(false);
      detector.setOnline(true);
      const state = detector.getState();
      expect(state.online).toBe(true);
      expect(state.profile).toBe('standard');
      detector.destroy();
    });
  });

  describe('listener notifications', () => {
    it('notifies listeners on state change', () => {
      const detector = new ConnectivityDetector();
      const listener = vi.fn();
      detector.onStateChange(listener);
      detector.setOnline(false);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ online: false, profile: 'offline' })
      );
      detector.destroy();
    });

    it('returns an unsubscribe function', () => {
      const detector = new ConnectivityDetector();
      const listener = vi.fn();
      const unsub = detector.onStateChange(listener);
      unsub();
      detector.setOnline(false);
      expect(listener).not.toHaveBeenCalled();
      detector.destroy();
    });

    it('does not notify if state has not changed (deduplication)', () => {
      const detector = new ConnectivityDetector();
      const listener = vi.fn();
      detector.onStateChange(listener);

      // Already online/standard, setting online again should not trigger
      detector.setOnline(true);
      expect(listener).not.toHaveBeenCalled();
      detector.destroy();
    });

    it('deduplication: same profile after forceCheck does not notify', async () => {
      const checkFn: ConnectivityCheckFn = async () => ({
        online: true,
        latencyMs: 50,
        bandwidthKbps: 10000,
      });
      const detector = new ConnectivityDetector({ checkFn });
      const listener = vi.fn();
      detector.onStateChange(listener);

      // Initial state is standard, check returns standard — no change
      await detector.forceCheck();
      expect(listener).not.toHaveBeenCalled();
      detector.destroy();
    });
  });

  describe('start/stop', () => {
    it('performs periodic checks after start', async () => {
      const checkFn = vi.fn(async () => ({
        online: true,
        latencyMs: 50,
        bandwidthKbps: 10000,
      }));

      const detector = new ConnectivityDetector({
        checkIntervalMs: 1000,
        checkFn,
      });

      detector.start();
      expect(checkFn).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1000);
      expect(checkFn).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1000);
      expect(checkFn).toHaveBeenCalledTimes(2);

      detector.stop();
      await vi.advanceTimersByTimeAsync(2000);
      expect(checkFn).toHaveBeenCalledTimes(2);

      detector.destroy();
    });
  });

  describe('forceCheck', () => {
    it('updates state based on check result', async () => {
      const checkFn: ConnectivityCheckFn = async () => ({
        online: true,
        latencyMs: 600,
        bandwidthKbps: 100,
      });

      const detector = new ConnectivityDetector({ checkFn });
      const listener = vi.fn();
      detector.onStateChange(listener);

      await detector.forceCheck();
      const state = detector.getState();
      expect(state.online).toBe(true);
      expect(state.profile).toBe('satellite');
      expect(state.latencyMs).toBe(600);
      expect(state.bandwidthKbps).toBe(100);
      expect(listener).toHaveBeenCalledTimes(1);
      detector.destroy();
    });

    it('returns the updated state', async () => {
      const checkFn: ConnectivityCheckFn = async () => ({
        online: true,
        latencyMs: 100,
        bandwidthKbps: 50,
      });

      const detector = new ConnectivityDetector({ checkFn });
      const state = await detector.forceCheck();
      expect(state.profile).toBe('edge');
      detector.destroy();
    });
  });

  describe('offline detection via failed checks', () => {
    it('goes offline after threshold is exceeded', async () => {
      const checkFn: ConnectivityCheckFn = async () => ({
        online: false,
      });

      const detector = new ConnectivityDetector({
        checkFn,
        checkIntervalMs: 1000,
        offlineThresholdMs: 3000,
      });

      const listener = vi.fn();
      detector.onStateChange(listener);

      detector.start();

      // First check at t=1000 — threshold not yet exceeded
      await vi.advanceTimersByTimeAsync(1000);
      expect(detector.getState().online).toBe(true);

      // Advance past threshold
      await vi.advanceTimersByTimeAsync(3000);
      expect(detector.getState().online).toBe(false);
      expect(detector.getState().profile).toBe('offline');
      expect(listener).toHaveBeenCalled();

      detector.destroy();
    });

    it('handles check function throwing errors', async () => {
      const checkFn: ConnectivityCheckFn = async () => {
        throw new Error('Network error');
      };

      const detector = new ConnectivityDetector({
        checkFn,
        offlineThresholdMs: 0, // immediately offline on failure
      });

      await detector.forceCheck();
      expect(detector.getState().online).toBe(false);
      detector.destroy();
    });

    it('skips check after destroy', async () => {
      const checkFn = vi.fn(async () => ({ online: true, latencyMs: 50, bandwidthKbps: 10_000 }));
      const detector = new ConnectivityDetector({ checkFn });
      detector.destroy();
      await detector.forceCheck();
      expect(checkFn).not.toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('clears timers and listeners', async () => {
      const checkFn = vi.fn(async () => ({ online: true }));
      const detector = new ConnectivityDetector({
        checkFn,
        checkIntervalMs: 1000,
      });

      const listener = vi.fn();
      detector.onStateChange(listener);
      detector.start();

      detector.destroy();

      // Timer should be cleared
      await vi.advanceTimersByTimeAsync(5000);
      expect(checkFn).not.toHaveBeenCalled();

      // Listeners should be cleared — setOnline should not notify
      // (listeners are cleared, so even though state changes, no notification)
      detector.setOnline(false);
      expect(listener).not.toHaveBeenCalled();
    });

    it('prevents start after destroy', async () => {
      const checkFn = vi.fn(async () => ({ online: true }));
      const detector = new ConnectivityDetector({
        checkFn,
        checkIntervalMs: 1000,
      });

      detector.destroy();
      detector.start();

      await vi.advanceTimersByTimeAsync(5000);
      expect(checkFn).not.toHaveBeenCalled();
    });
  });
});
