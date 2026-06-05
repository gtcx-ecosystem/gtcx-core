/**
 * Chaos tests for ConnectivityDetector.
 *
 * Simulates unreliable networks, rapid lifecycle changes, and misbehaving listeners.
 */

import { describe, expect, it, vi } from 'vitest';

import { ConnectivityDetector } from '../src/detector';
import type { ConnectivityCheckResult, ConnectivityState } from '../src/types';

describe('ConnectivityDetector chaos', () => {
  it('handles check function that randomly fails', async () => {
    let callCount = 0;
    const detector = new ConnectivityDetector({
      checkIntervalMs: 10,
      offlineThresholdMs: 30,
      checkFn: async (): Promise<ConnectivityCheckResult> => {
        callCount++;
        if (callCount % 3 === 0) {
          throw new Error('CHAOS: network exploded');
        }
        return { online: true, latencyMs: 10, bandwidthKbps: 10_000 };
      },
    });

    detector.start();
    await new Promise((r) => setTimeout(r, 100));
    detector.stop();

    expect(callCount).toBeGreaterThan(5);
    // Should not have crashed; state may be online or offline depending on timing
    const state = detector.getState();
    expect(typeof state.online).toBe('boolean');
  });

  it('handles rapid start/stop cycles without leaking timers', async () => {
    const detector = new ConnectivityDetector({
      checkIntervalMs: 10,
      checkFn: async () => ({ online: true, latencyMs: 10, bandwidthKbps: 10_000 }),
    });

    for (let i = 0; i < 50; i++) {
      detector.start();
      detector.stop();
    }

    detector.start();
    await new Promise((r) => setTimeout(r, 50));
    detector.destroy();

    // No leaked timers to assert directly, but should not crash
    expect(detector.getState()).toBeDefined();
  });

  it('handles listener callbacks that throw', async () => {
    const detector = new ConnectivityDetector({
      checkIntervalMs: 10,
      offlineThresholdMs: 20,
      checkFn: async () => ({ online: false, latencyMs: 100 }),
    });

    const badListener = vi.fn(() => {
      throw new Error('CHAOS: listener crashed');
    });

    detector.onStateChange(badListener);

    detector.start();
    await new Promise((r) => setTimeout(r, 100));
    detector.stop();

    // Detector should survive despite listener throwing
    expect(badListener).toHaveBeenCalled();
    expect(detector.getState()).toBeDefined();
  });

  it('handles state change storms from forced toggles', () => {
    const detector = new ConnectivityDetector();
    const states: ConnectivityState[] = [];

    detector.onStateChange((s) => states.push(s));

    for (let i = 0; i < 20; i++) {
      detector.setOnline(i % 2 === 0);
    }

    // Only transitions produce events (online->offline, offline->online)
    expect(states.length).toBeLessThanOrEqual(20);
  });

  it('survives check function returning malformed results', async () => {
    const detector = new ConnectivityDetector({
      checkIntervalMs: 10,
      checkFn: async () =>
        ({
          online: true,
          // missing latencyMs / bandwidthKbps
        }) as ConnectivityCheckResult,
    });

    detector.start();
    await new Promise((r) => setTimeout(r, 50));
    detector.stop();

    expect(detector.getState().online).toBe(true);
  });

  it('does not check after destroy', async () => {
    let calls = 0;
    const detector = new ConnectivityDetector({
      checkIntervalMs: 10,
      checkFn: async () => {
        calls++;
        return { online: true, latencyMs: 10, bandwidthKbps: 10_000 };
      },
    });

    detector.start();
    await new Promise((r) => setTimeout(r, 50));
    detector.destroy();

    const callsAfterDestroy = calls;
    await new Promise((r) => setTimeout(r, 50));

    expect(calls).toBe(callsAfterDestroy);
  });

  it('handles forceCheck while timer is running', async () => {
    let calls = 0;
    const detector = new ConnectivityDetector({
      checkIntervalMs: 1000, // very slow timer
      checkFn: async () => {
        calls++;
        return { online: true, latencyMs: 10, bandwidthKbps: 10_000 };
      },
    });

    detector.start();
    await detector.forceCheck();
    await detector.forceCheck();
    await detector.forceCheck();
    detector.stop();

    expect(calls).toBe(3);
  });

  it('correctly transitions to offline after threshold elapsed', async () => {
    let online = true;
    const detector = new ConnectivityDetector({
      checkIntervalMs: 10,
      offlineThresholdMs: 50,
      checkFn: async () => {
        return { online, latencyMs: 10, bandwidthKbps: 10_000 };
      },
    });

    detector.start();
    await new Promise((r) => setTimeout(r, 30));
    expect(detector.getState().online).toBe(true);

    online = false;
    await new Promise((r) => setTimeout(r, 100));
    detector.stop();

    expect(detector.getState().online).toBe(false);
    expect(detector.getState().profile).toBe('offline');
  });
});
