/**
 * @gtcx/services - Health Checks
 *
 * Standardized health-check and readiness probe contract for
 * operational deployment of GTCX services.
 *
 * @packageDocumentation
 */

import { getBackend } from '@gtcx/crypto';

import type { IStorageService } from './compliance/types';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    crypto: boolean;
    storage: boolean;
    nativeBindings?: boolean;
  };
  timestamp: string;
}

export interface HealthCheckDeps {
  storageService?: IStorageService | null;
}

// ---------------------------------------------------------------------------
// HEALTH CHECK IMPLEMENTATION
// ---------------------------------------------------------------------------

/**
 * Run health checks against service dependencies.
 *
 * @example
 * const result = await runHealthChecks({ storageService: myStorage });
 * if (result.status !== 'healthy') {
 *   // trigger alert or readiness probe failure
 * }
 */
export async function runHealthChecks(deps: HealthCheckDeps = {}): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();

  // Crypto backend check
  let cryptoHealthy = false;
  let nativeBindingsHealthy: boolean | undefined;
  try {
    const backend = getBackend();
    cryptoHealthy = backend === 'native' || backend === 'js';
    nativeBindingsHealthy = backend === 'native';
  } catch {
    cryptoHealthy = false;
  }

  // Storage service check
  let storageHealthy = false;
  if (deps.storageService) {
    try {
      const testKey = `__health_check_${Date.now()}`;
      await deps.storageService.set(testKey, { ok: true });
      const value = await deps.storageService.get(testKey);
      storageHealthy =
        value !== null &&
        typeof value === 'object' &&
        (value as Record<string, unknown>)['ok'] === true;
    } catch {
      storageHealthy = false;
    }
  } else {
    // No storage configured — mark as healthy (not required for all deployments)
    storageHealthy = true;
  }

  // Aggregate status
  let status: HealthCheckResult['status'] = 'healthy';
  if (!cryptoHealthy) {
    status = 'unhealthy';
  } else if (!storageHealthy) {
    status = 'degraded';
  }

  return {
    status,
    checks: {
      crypto: cryptoHealthy,
      storage: storageHealthy,
      ...(nativeBindingsHealthy !== undefined && { nativeBindings: nativeBindingsHealthy }),
    },
    timestamp,
  };
}
