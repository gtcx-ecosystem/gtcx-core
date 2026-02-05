import { describe, expect, it, vi } from 'vitest';

import { UnifiedComplianceService } from '../src/compliance';
import type { ICryptoService, IStorageService } from '../src/types';

const mockCryptoService = (): ICryptoService => ({
  createHash: vi.fn(async () => 'hash'),
  sign: vi.fn(async () => 'sig'),
  verify: vi.fn(async () => true),
  signTransaction: vi.fn(async () => 'txsig'),
});

const mockStorageService = (): IStorageService => ({
  saveAssetLot: vi.fn(async () => undefined),
  getAssetLot: vi.fn(async () => null),
  saveCertificate: vi.fn(async () => undefined),
  saveTransaction: vi.fn(async () => undefined),
});

describe('UnifiedComplianceService', () => {
  it('generates a compliance report with empty data', async () => {
    const service = new UnifiedComplianceService(
      {
        storageService: mockStorageService(),
        cryptoService: mockCryptoService(),
      },
      {}
    );

    const { report, metadata } = await service.generateComplianceReport({
      dateRange: {
        start: '2024-01-01T00:00:00Z',
        end: '2024-12-31T00:00:00Z',
      },
      format: 'summary',
      categories: ['labor'],
    });

    expect(report.summary.totalRecords).toBe(0);
    expect(metadata.complianceScore).toBe(100);
  });
});
