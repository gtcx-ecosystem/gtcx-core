export type ConnectivityProfile =
  | 'offline'
  | 'ussd-only'
  | 'edge'
  | 'degraded'
  | 'standard'
  | 'satellite';

export interface ConnectivityState {
  online: boolean;
  profile: ConnectivityProfile;
  lastChecked: number; // Unix timestamp ms
  latencyMs?: number;
  bandwidthKbps?: number;
}

export type ConnectivityListener = (state: ConnectivityState) => void;

export interface ConnectivityCheckResult {
  online: boolean;
  latencyMs?: number;
  bandwidthKbps?: number;
}

export type ConnectivityCheckFn = () => Promise<ConnectivityCheckResult>;

export interface ConnectivityDetectorOptions {
  checkIntervalMs?: number; // default 30000
  checkUrl?: string; // URL to ping for connectivity check
  offlineThresholdMs?: number; // after this long without success, consider offline (default 60000)
  checkFn?: ConnectivityCheckFn; // pluggable check function
}
