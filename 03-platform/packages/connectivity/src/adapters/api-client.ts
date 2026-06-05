/**
 * Connectivity → API Client bridge
 *
 * Wires ConnectivityDetector to api-client primitives so that
 * timeout, retry, and offline behavior adapt automatically to
 * the current network conditions.
 */

import type { ApiClientOptions, OfflineHandler } from '@gtcx/api-client';
import type { RetryPolicy } from '@gtcx/resilience';

import type { ConnectivityDetector } from '../detector.js';
import type { ConnectivityProfile } from '../types.js';

/** Create an OfflineHandler that delegates to a ConnectivityDetector. */
export function createOfflineHandlerFromDetector(detector: ConnectivityDetector): OfflineHandler {
  return {
    isOnline() {
      return detector.getState().online;
    },
    async enqueue(entry) {
      // The api-client's OfflineHandler only needs to enqueue;
      // actual queue implementation is provided by the consumer.
      // Return a synthetic operation ID based on the entry.
      return `queued-${entry.method}-${entry.path}-${entry.enqueuedAt}`;
    },
  };
}

/** Default resilience config per connectivity profile. */
export const DEFAULT_PROFILE_CONFIG: Record<
  ConnectivityProfile,
  { timeoutMs: number; retries: number; retryPolicy: RetryPolicy }
> = {
  offline: {
    timeoutMs: Number.POSITIVE_INFINITY,
    retries: 0,
    retryPolicy: {
      strategy: 'fixed',
      baseDelayMs: 0,
      maxDelayMs: 0,
      maxRetries: 0,
      jitter: 'none',
    },
  },
  'ussd-only': {
    timeoutMs: Number.POSITIVE_INFINITY,
    retries: 0,
    retryPolicy: {
      strategy: 'fixed',
      baseDelayMs: 0,
      maxDelayMs: 0,
      maxRetries: 0,
      jitter: 'none',
    },
  },
  edge: {
    timeoutMs: 60_000,
    retries: 1,
    retryPolicy: {
      strategy: 'adaptive',
      baseDelayMs: 2_000,
      maxDelayMs: 10_000,
      maxRetries: 1,
      jitter: 'decorrelated',
    },
  },
  degraded: {
    timeoutMs: 45_000,
    retries: 2,
    retryPolicy: {
      strategy: 'adaptive',
      baseDelayMs: 1_000,
      maxDelayMs: 5_000,
      maxRetries: 2,
      jitter: 'decorrelated',
    },
  },
  standard: {
    timeoutMs: 30_000,
    retries: 3,
    retryPolicy: {
      strategy: 'adaptive',
      baseDelayMs: 250,
      maxDelayMs: 2_000,
      maxRetries: 3,
      jitter: 'decorrelated',
    },
  },
  satellite: {
    timeoutMs: 120_000,
    retries: 5,
    retryPolicy: {
      strategy: 'adaptive',
      baseDelayMs: 5_000,
      maxDelayMs: 30_000,
      maxRetries: 5,
      jitter: 'decorrelated',
    },
  },
};

/**
 * Adapt ApiClientOptions for a given connectivity profile.
 *
 * Merges profile-specific timeout, retry count, and retry policy
 * into the provided options. Explicit options always win.
 */
export function adaptClientOptionsForProfile(
  profile: ConnectivityProfile,
  options: ApiClientOptions
): ApiClientOptions {
  const defaults = DEFAULT_PROFILE_CONFIG[profile];
  return {
    ...options,
    timeout: options.timeout ?? defaults.timeoutMs,
    retries: options.retries ?? defaults.retries,
    retryPolicy: options.retryPolicy ?? defaults.retryPolicy,
  };
}

/**
 * Create an api-client options object that automatically adapts
 * to connectivity profile changes.
 *
 * Returns the adapted options and a function to refresh them
 * when the profile changes.
 */
export function createAdaptiveClientOptions(
  detector: ConnectivityDetector,
  baseOptions: ApiClientOptions
): { options: ApiClientOptions; refresh: () => void; unsubscribe: () => void } {
  const currentOptions = adaptClientOptionsForProfile(detector.getState().profile, baseOptions);

  const unsubscribe = detector.onStateChange(() => {
    Object.assign(
      currentOptions,
      adaptClientOptionsForProfile(detector.getState().profile, baseOptions)
    );
  });

  function refresh(): void {
    Object.assign(
      currentOptions,
      adaptClientOptionsForProfile(detector.getState().profile, baseOptions)
    );
  }

  return {
    get options() {
      return currentOptions;
    },
    refresh,
    unsubscribe,
  };
}
