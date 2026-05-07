/**
 * @gtcx/services — Health check tests
 */

import { getBackend } from '@gtcx/crypto';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { IStorageService } from '../src/compliance/types';
import { runHealthChecks } from '../src/health';

vi.mock('@gtcx/crypto', () => ({
  getBackend: vi.fn(),
}));

const mockGetBackend = vi.mocked(getBackend);

describe('runHealthChecks', () => {
  beforeEach(() => {
    mockGetBackend.mockReset();
  });

  it('should report healthy when crypto is available and no storage configured', async () => {
    mockGetBackend.mockReturnValue('native');

    const result = await runHealthChecks();

    expect(result.status).toBe('healthy');
    expect(result.checks.crypto).toBe(true);
    expect(result.checks.storage).toBe(true);
    expect(result.checks.nativeBindings).toBe(true);
    expect(result.timestamp).toBeDefined();
  });

  it('should report healthy with JS crypto fallback', async () => {
    mockGetBackend.mockReturnValue('js');

    const result = await runHealthChecks();

    expect(result.status).toBe('healthy');
    expect(result.checks.crypto).toBe(true);
    expect(result.checks.nativeBindings).toBe(false);
  });

  it('should report unhealthy when crypto backend throws', async () => {
    mockGetBackend.mockImplementation(() => {
      throw new Error('Crypto init failed');
    });

    const result = await runHealthChecks();

    expect(result.status).toBe('unhealthy');
    expect(result.checks.crypto).toBe(false);
  });

  it('should report degraded when storage check fails', async () => {
    mockGetBackend.mockReturnValue('native');
    const badStorage: IStorageService = {
      get: vi.fn().mockRejectedValue(new Error('Storage unreachable')),
      set: vi.fn().mockRejectedValue(new Error('Storage unreachable')),
    };

    const result = await runHealthChecks({ storageService: badStorage });

    expect(result.status).toBe('degraded');
    expect(result.checks.crypto).toBe(true);
    expect(result.checks.storage).toBe(false);
  });

  it('should report healthy when storage check passes', async () => {
    mockGetBackend.mockReturnValue('native');
    const goodStorage: IStorageService = {
      get: vi.fn().mockResolvedValue({ ok: true }),
      set: vi.fn().mockResolvedValue(undefined),
    };

    const result = await runHealthChecks({ storageService: goodStorage });

    expect(result.status).toBe('healthy');
    expect(result.checks.crypto).toBe(true);
    expect(result.checks.storage).toBe(true);
    expect(goodStorage.set).toHaveBeenCalled();
    expect(goodStorage.get).toHaveBeenCalled();
  });

  it('should include a valid ISO timestamp', async () => {
    mockGetBackend.mockReturnValue('native');
    const before = new Date().toISOString();

    const result = await runHealthChecks();

    const after = new Date().toISOString();
    expect(result.timestamp >= before).toBe(true);
    expect(result.timestamp <= after).toBe(true);
  });
});
