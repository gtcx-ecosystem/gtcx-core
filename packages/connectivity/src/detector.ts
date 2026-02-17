import { classifyProfile } from './profiles.js';
import type {
  ConnectivityCheckFn,
  ConnectivityCheckResult,
  ConnectivityDetectorOptions,
  ConnectivityListener,
  ConnectivityState,
} from './types.js';

const DEFAULT_CHECK_INTERVAL_MS = 30_000;
const DEFAULT_OFFLINE_THRESHOLD_MS = 60_000;

/**
 * Default check function that always reports online with standard connectivity.
 * Replace with a real implementation that pings a health endpoint.
 */
const defaultCheckFn: ConnectivityCheckFn = async (): Promise<ConnectivityCheckResult> => ({
  online: true,
  latencyMs: 50,
  bandwidthKbps: 10_000,
});

/**
 * ConnectivityDetector provides network status detection for offline-first operation (Principle P8).
 *
 * It periodically checks connectivity and notifies listeners when the state changes.
 * A pluggable `checkFn` allows injecting custom connectivity probes.
 */
export class ConnectivityDetector {
  private readonly checkIntervalMs: number;
  private readonly offlineThresholdMs: number;
  private readonly checkFn: ConnectivityCheckFn;

  private state: ConnectivityState;
  private listeners: Set<ConnectivityListener> = new Set();
  private timer: ReturnType<typeof setInterval> | null = null;
  private lastSuccessTime: number;
  private destroyed = false;

  constructor(options?: ConnectivityDetectorOptions) {
    this.checkIntervalMs = options?.checkIntervalMs ?? DEFAULT_CHECK_INTERVAL_MS;
    this.offlineThresholdMs = options?.offlineThresholdMs ?? DEFAULT_OFFLINE_THRESHOLD_MS;
    this.checkFn = options?.checkFn ?? defaultCheckFn;
    this.lastSuccessTime = Date.now();

    this.state = {
      online: true,
      profile: 'standard',
      lastChecked: Date.now(),
    };
  }

  /** Get the current connectivity state. */
  getState(): ConnectivityState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   * Listeners are only called when the state actually changes.
   */
  onStateChange(listener: ConnectivityListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Begin periodic connectivity checks. */
  start(): void {
    if (this.destroyed) return;
    this.stop(); // clear any existing timer
    this.timer = setInterval(() => {
      void this.performCheck();
    }, this.checkIntervalMs);
  }

  /** Stop periodic connectivity checks. */
  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** Trigger an immediate connectivity check. */
  async forceCheck(): Promise<ConnectivityState> {
    await this.performCheck();
    return this.getState();
  }

  /**
   * Manually set online/offline state. Useful for testing or manual override.
   * When setting offline, profile is set to 'offline'.
   * When setting online, profile is set to 'standard' (with no measurement data).
   */
  setOnline(online: boolean): void {
    const newState: ConnectivityState = {
      online,
      profile: online ? 'standard' : 'offline',
      lastChecked: Date.now(),
    };
    this.updateState(newState);
  }

  /** Clean up timers and listeners. The detector cannot be reused after destroy. */
  destroy(): void {
    this.stop();
    this.listeners.clear();
    this.destroyed = true;
  }

  private async performCheck(): Promise<void> {
    if (this.destroyed) return;

    try {
      const result = await this.checkFn();
      const now = Date.now();

      if (result.online) {
        this.lastSuccessTime = now;

        const latencyMs = result.latencyMs ?? 50;
        const bandwidthKbps = result.bandwidthKbps ?? 10_000;
        const profile = classifyProfile(bandwidthKbps, latencyMs);

        this.updateState({
          online: true,
          profile,
          lastChecked: now,
          latencyMs,
          bandwidthKbps,
        });
      } else {
        this.handleCheckFailure(now);
      }
    } catch {
      this.handleCheckFailure(Date.now());
    }
  }

  private handleCheckFailure(now: number): void {
    const timeSinceLastSuccess = now - this.lastSuccessTime;

    if (timeSinceLastSuccess >= this.offlineThresholdMs) {
      this.updateState({
        online: false,
        profile: 'offline',
        lastChecked: now,
      });
    } else {
      // Not yet past threshold — keep current state but update lastChecked
      this.updateState({
        ...this.state,
        lastChecked: now,
      });
    }
  }

  private updateState(newState: ConnectivityState): void {
    const changed =
      this.state.online !== newState.online || this.state.profile !== newState.profile;

    this.state = newState;

    if (changed) {
      for (const listener of this.listeners) {
        listener(this.getState());
      }
    }
  }
}
