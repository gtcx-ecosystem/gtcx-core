import { describe, expect, it, vi } from 'vitest';

import { AssetLotRegistrationService } from '../src/registration';
import type { ICryptoService, ILocationService, IStorageService } from '../src/types';

const mockCryptoService = (): ICryptoService => ({
  createHash: vi.fn(async () => 'hash'),
  sign: vi.fn(async () => 'sig'),
  verify: vi.fn(async () => true),
  signTransaction: vi.fn(async () => 'txsig'),
});

const mockLocationService = (): ILocationService => ({
  getCurrentLocation: vi.fn(async () => ({
    latitude: 1,
    longitude: 2,
    accuracy: 5,
    timestamp: Date.now(),
  })),
  reverseGeocode: vi.fn(async () => ({ formattedAddress: 'Test' })),
});

const mockStorageService = (): IStorageService => ({
  saveAssetLot: vi.fn(async () => undefined),
  getAssetLot: vi.fn(async () => null),
  saveCertificate: vi.fn(async () => undefined),
  saveTransaction: vi.fn(async () => undefined),
});

const registrationData = {
  commodityType: 'gold',
  producerId: '11111111-1111-4111-8111-111111111111',
  discoveryLocation: {
    latitude: 5.5,
    longitude: 6.6,
    accuracy: 4,
    timestamp: Date.now(),
  },
  photos: [
    {
      uri: 'file://photo-1.jpg',
      timestamp: Date.now(),
      hash: 'a'.repeat(32),
    },
    {
      uri: 'file://photo-2.jpg',
      timestamp: Date.now(),
      hash: 'b'.repeat(32),
    },
  ],
  estimatedWeight: 25,
  weightUnit: 'kg',
  purity: 98,
};

describe('AssetLotRegistrationService', () => {
  it('validates registration data and registers asset lot', async () => {
    const service = new AssetLotRegistrationService(
      {
        cryptoService: mockCryptoService(),
        locationService: mockLocationService(),
        storageService: mockStorageService(),
      },
      {}
    );

    const validation = service.validateRegistrationData(registrationData);
    expect(validation.isValid).toBe(true);

    const lot = await service.registerAssetLot(registrationData);

    expect(lot.id).toBeTruthy();
    expect(lot.status).toBe('registered');
    expect(lot.weight).toBe(25);
    expect(lot.weightUnit).toBe('kg');
    expect(lot.cryptoProof).toBe('hash');
    expect(lot.certificateId).toBeTruthy();
  });

  it('calculates progress for partial data', () => {
    const service = new AssetLotRegistrationService(
      {
        cryptoService: mockCryptoService(),
        locationService: mockLocationService(),
        storageService: mockStorageService(),
      },
      {}
    );

    const progress = service.calculateProgress({
      commodityType: 'gold',
      discoveryLocation: {
        latitude: 1,
        longitude: 2,
        accuracy: 5,
        timestamp: Date.now(),
      },
      photos: [
        {
          uri: 'file://photo.jpg',
          timestamp: Date.now(),
        },
        {
          uri: 'file://photo2.jpg',
          timestamp: Date.now(),
        },
      ],
      estimatedWeight: 10,
      weightUnit: 'kg',
    });

    expect(progress.percentage).toBeGreaterThan(0);
    expect(progress.completedSteps.length).toBeGreaterThan(0);
  });
});
