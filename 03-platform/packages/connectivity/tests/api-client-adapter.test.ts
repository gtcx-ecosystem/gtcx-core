import { describe, expect, it } from 'vitest';

import {
  adaptClientOptionsForProfile,
  createAdaptiveClientOptions,
  createOfflineHandlerFromDetector,
  DEFAULT_PROFILE_CONFIG,
} from '../src/adapters/api-client.js';
import { ConnectivityDetector } from '../src/detector.js';

describe('createOfflineHandlerFromDetector', () => {
  it('returns isOnline=true when detector is online', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true);
    const handler = createOfflineHandlerFromDetector(detector);
    expect(handler.isOnline()).toBe(true);
  });

  it('returns isOnline=false when detector is offline', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(false);
    const handler = createOfflineHandlerFromDetector(detector);
    expect(handler.isOnline()).toBe(false);
  });

  it('enqueue returns a queued operation id', async () => {
    const detector = new ConnectivityDetector();
    const handler = createOfflineHandlerFromDetector(detector);
    const id = await handler.enqueue({
      method: 'POST',
      path: '/test',
      headers: {},
      body: '',
      enqueuedAt: 1_700_000_000_000,
    });
    expect(id).toMatch(/^queued-POST-\/test-/);
  });
});

describe('adaptClientOptionsForProfile', () => {
  it('applies standard profile defaults when no overrides given', () => {
    const options = adaptClientOptionsForProfile('standard', { baseUrl: 'https://x' });
    expect(options.timeout).toBe(DEFAULT_PROFILE_CONFIG.standard.timeoutMs);
    expect(options.retries).toBe(DEFAULT_PROFILE_CONFIG.standard.retries);
    expect(options.retryPolicy).toEqual(DEFAULT_PROFILE_CONFIG.standard.retryPolicy);
  });

  it('applies edge profile defaults', () => {
    const options = adaptClientOptionsForProfile('edge', { baseUrl: 'https://x' });
    expect(options.timeout).toBe(60_000);
    expect(options.retries).toBe(1);
    expect(options.retryPolicy?.strategy).toBe('adaptive');
  });

  it('applies satellite profile defaults', () => {
    const options = adaptClientOptionsForProfile('satellite', { baseUrl: 'https://x' });
    expect(options.timeout).toBe(120_000);
    expect(options.retries).toBe(5);
  });

  it('explicit options override profile defaults', () => {
    const options = adaptClientOptionsForProfile('standard', {
      baseUrl: 'https://x',
      timeout: 5_000,
      retries: 1,
    });
    expect(options.timeout).toBe(5_000);
    expect(options.retries).toBe(1);
  });

  it('preserves baseUrl and other options', () => {
    const options = adaptClientOptionsForProfile('standard', {
      baseUrl: 'https://x',
      headers: { 'X-Custom': '1' },
    });
    expect(options.baseUrl).toBe('https://x');
    expect(options.headers).toEqual({ 'X-Custom': '1' });
  });
});

describe('createAdaptiveClientOptions', () => {
  it('initialises with current profile defaults', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true); // standard
    const { options } = createAdaptiveClientOptions(detector, { baseUrl: 'https://x' });
    expect(options.timeout).toBe(DEFAULT_PROFILE_CONFIG.standard.timeoutMs);
  });

  it('updates options when profile changes', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true); // standard
    const { options } = createAdaptiveClientOptions(detector, { baseUrl: 'https://x' });

    // Simulate a profile change by going offline
    detector.setOnline(false);
    expect(options.timeout).toBe(Number.POSITIVE_INFINITY);
    expect(options.retries).toBe(0);
  });

  it('refresh updates options to current profile', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true);
    const { options, refresh } = createAdaptiveClientOptions(detector, { baseUrl: 'https://x' });

    detector.setOnline(false);
    refresh();
    expect(options.timeout).toBe(Number.POSITIVE_INFINITY);
  });

  it('unsubscribe stops further updates', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(true);
    const { options, unsubscribe } = createAdaptiveClientOptions(detector, {
      baseUrl: 'https://x',
    });

    unsubscribe();
    detector.setOnline(false);
    // Should still be standard because listener was removed
    expect(options.timeout).toBe(DEFAULT_PROFILE_CONFIG.standard.timeoutMs);
  });

  it('uses offline profile when detector is offline', () => {
    const detector = new ConnectivityDetector();
    detector.setOnline(false);
    const { options } = createAdaptiveClientOptions(detector, { baseUrl: 'https://x' });
    expect(options.timeout).toBe(Number.POSITIVE_INFINITY);
    expect(options.retries).toBe(0);
  });
});
