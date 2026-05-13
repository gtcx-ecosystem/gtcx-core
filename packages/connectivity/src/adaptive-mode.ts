import { RequestBatcher } from './batching.js';
import type { BatchFlushFn } from './batching.js';
import { compressPayload, decompressPayload } from './compression.js';
import type { CompressedPayload } from './compression.js';
import type { ConnectivityDetector } from './detector.js';
import { downsampleConfig } from './images.js';
import type { DownsampleConfig } from './images.js';
import type { ConnectivityProfile } from './types.js';

export interface AdaptiveModeConfig {
  /** Profiles that trigger compression. Defaults to edge, ussd-only, satellite. */
  compressionProfiles?: ConnectivityProfile[];
  /** Profiles that trigger image downsampling. Defaults to edge, ussd-only, satellite. */
  imageProfiles?: ConnectivityProfile[];
  /** Profiles that trigger request batching. Defaults to edge, ussd-only, satellite. */
  batchingProfiles?: ConnectivityProfile[];
  /** Maximum number of requests in a batch before auto-flush. */
  batchingMaxSize?: number;
  /** Interval in ms between automatic batch flushes. */
  batchingFlushIntervalMs?: number;
  /** Function called to flush a batch of requests. Required for batching to work. */
  batchFlushFn?: BatchFlushFn;
}

export interface AdaptiveMode {
  compression: {
    shouldCompress: () => boolean;
    compressPayload: (data: unknown) => Promise<CompressedPayload>;
    decompressPayload: (compressed: CompressedPayload) => Promise<unknown>;
  };
  images: {
    shouldDownsample: () => boolean;
    downsampleConfig: () => DownsampleConfig;
  };
  batching: {
    batcher: RequestBatcher;
    isActive: () => boolean;
  };
  /** Current connectivity profile. */
  get profile(): ConnectivityProfile;
}

const DEFAULT_ACTIVE_PROFILES: ConnectivityProfile[] = ['edge', 'ussd-only', 'satellite'];

const noopFlushFn: BatchFlushFn = async () => {
  throw new Error('No batchFlushFn configured in AdaptiveModeConfig');
};

/**
 * Create an adaptive mode orchestrator bound to a ConnectivityDetector.
 *
 * All thresholds are driven by the provided config (with sensible defaults).
 * The returned object exposes compression, image, and batching utilities
 * that automatically respect the current connectivity profile.
 */
export function createAdaptiveMode(
  detector: ConnectivityDetector,
  config?: AdaptiveModeConfig
): AdaptiveMode {
  const compressionProfiles = new Set(config?.compressionProfiles ?? DEFAULT_ACTIVE_PROFILES);
  const imageProfiles = new Set(config?.imageProfiles ?? DEFAULT_ACTIVE_PROFILES);
  const batchingProfiles = new Set(config?.batchingProfiles ?? DEFAULT_ACTIVE_PROFILES);

  const getProfile = (): ConnectivityProfile => detector.getState().profile;

  const batcherOptions: ConstructorParameters<typeof RequestBatcher>[0] = {
    flushFn: config?.batchFlushFn ?? noopFlushFn,
    getProfile,
    activeProfiles: Array.from(batchingProfiles),
  };

  if (config?.batchingMaxSize !== undefined) {
    batcherOptions.maxBatchSize = config.batchingMaxSize;
  }
  if (config?.batchingFlushIntervalMs !== undefined) {
    batcherOptions.flushIntervalMs = config.batchingFlushIntervalMs;
  }

  const batcher = new RequestBatcher(batcherOptions);

  return {
    get profile() {
      return getProfile();
    },
    compression: {
      shouldCompress: () => compressionProfiles.has(getProfile()),
      compressPayload,
      decompressPayload,
    },
    images: {
      shouldDownsample: () => imageProfiles.has(getProfile()),
      downsampleConfig: () => downsampleConfig(getProfile()),
    },
    batching: {
      batcher,
      isActive: () => batchingProfiles.has(getProfile()),
    },
  };
}
