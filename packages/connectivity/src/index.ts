export { ConnectivityDetector } from './detector.js';
export { classifyProfile } from './profiles.js';
export {
  createOfflineHandlerFromDetector,
  adaptClientOptionsForProfile,
  createAdaptiveClientOptions,
  DEFAULT_PROFILE_CONFIG,
} from './adapters/api-client.js';
export type {
  ConnectivityCheckFn,
  ConnectivityCheckResult,
  ConnectivityDetectorOptions,
  ConnectivityListener,
  ConnectivityProfile,
  ConnectivityState,
} from './types.js';
