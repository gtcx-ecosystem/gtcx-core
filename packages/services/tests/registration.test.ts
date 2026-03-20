/**
 * AssetLotRegistrationService Tests
 *
 * Tests for commodity-agnostic asset lot registration,
 * validation, progress tracking, and cryptographic proof generation.
 */

import type { ICryptoService, ILocationService, IStorageService } from '@gtcx/domain';

import { AssetLotRegistrationService } from '../src/registration';

// ============================================================================
// HELPERS
// ============================================================================

function createMockCryptoService(): ICryptoService {
  return {
    createHash: vi.fn().mockResolvedValue('mock-hash-abc123'),
    sign: vi.fn().mockResolvedValue('mock-signature-xyz789'),
    verify: vi.fn().mockResolvedValue(true),
    signTransaction: vi.fn().mockResolvedValue('mock-tx-signature'),
  };
}

function createMockLocationService(): ILocationService {
  return {
    getCurrentLocation: vi.fn().mockResolvedValue({
      latitude: 5.6037,
      longitude: -0.187,
      accuracy: 5,
      timestamp: Date.now(),
    }),
    reverseGeocode: vi.fn().mockResolvedValue({ formattedAddress: 'Accra, Ghana' }),
  };
}

function createMockStorageService(): IStorageService {
  return {
    saveAssetLot: vi.fn().mockResolvedValue(undefined),
    getAssetLot: vi.fn().mockResolvedValue(null),
    saveCertificate: vi.fn().mockResolvedValue(undefined),
    saveTransaction: vi.fn().mockResolvedValue(undefined),
  };
}

function createMockEventEmitter() {
  return {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };
}

function createValidRegistrationData(overrides: Record<string, unknown> = {}) {
  return {
    commodityType: 'gold',
    producerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    discoveryLocation: {
      latitude: 5.6037,
      longitude: -0.187,
      accuracy: 5,
      timestamp: Date.now(),
    },
    photos: [
      { uri: 'file:///photo1.jpg', timestamp: Date.now() },
      { uri: 'file:///photo2.jpg', timestamp: Date.now() },
    ],
    estimatedWeight: 250,
    weightUnit: 'g' as const,
    form: 'nugget',
    quality: 'high' as const,
    purity: 85,
    discoveryDate: new Date().toISOString(),
    ...overrides,
  };
}

function createService(
  overrides: {
    cryptoService?: ICryptoService;
    locationService?: ILocationService;
    storageService?: IStorageService;
    eventEmitter?: ReturnType<typeof createMockEventEmitter>;
    config?: Record<string, unknown>;
  } = {}
) {
  return new AssetLotRegistrationService(
    {
      cryptoService: overrides.cryptoService ?? createMockCryptoService(),
      locationService: overrides.locationService ?? createMockLocationService(),
      storageService: overrides.storageService ?? createMockStorageService(),
      eventEmitter: overrides.eventEmitter as never,
    },
    overrides.config ?? {}
  );
}

// ============================================================================
// TESTS
// ============================================================================

describe('AssetLotRegistrationService', () => {
  // --------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------

  describe('constructor', () => {
    it('accepts valid config and creates service', () => {
      const service = createService();
      expect(service).toBeInstanceOf(AssetLotRegistrationService);
    });

    it('accepts partial config and merges with defaults', () => {
      const service = createService({ config: { minPhotos: 3 } });
      expect(service).toBeInstanceOf(AssetLotRegistrationService);
    });

    it('accepts empty config object', () => {
      const service = createService({ config: {} });
      expect(service).toBeInstanceOf(AssetLotRegistrationService);
    });

    it('throws on invalid config: minGpsAccuracy negative', () => {
      expect(() => createService({ config: { minGpsAccuracy: -5 } })).toThrow(
        /Invalid registration config/
      );
    });

    it('throws on invalid config: minPhotos zero', () => {
      expect(() => createService({ config: { minPhotos: 0 } })).toThrow(
        /Invalid registration config/
      );
    });

    it('throws on invalid config: maxDiscoveryAgeDays exceeds 365', () => {
      expect(() => createService({ config: { maxDiscoveryAgeDays: 500 } })).toThrow(
        /Invalid registration config/
      );
    });
  });

  // --------------------------------------------------------------------------
  // getWorkflowSteps
  // --------------------------------------------------------------------------

  describe('getWorkflowSteps()', () => {
    it('returns default 4 workflow steps', () => {
      const service = createService();
      const steps = service.getWorkflowSteps();

      expect(steps).toHaveLength(4);
      expect(steps.map((s) => s.id)).toEqual(['location', 'photos', 'details', 'review']);
    });

    it('all default steps are required', () => {
      const service = createService();
      const steps = service.getWorkflowSteps();

      for (const step of steps) {
        expect(step.isRequired).toBe(true);
      }
    });

    it('steps have sequential order', () => {
      const service = createService();
      const steps = service.getWorkflowSteps();

      steps.forEach((step, index) => {
        expect(step.order).toBe(index + 1);
      });
    });

    it('returns custom workflow steps when configured', () => {
      const customSteps = [
        { id: 'step1', title: 'Step One', required: true },
        { id: 'step2', title: 'Step Two', required: false },
      ];

      const service = createService({ config: { workflowSteps: customSteps } });
      const steps = service.getWorkflowSteps();

      expect(steps).toHaveLength(2);
      expect(steps[0]!.id).toBe('step1');
      expect(steps[0]!.title).toBe('Step One');
      expect(steps[0]!.isRequired).toBe(true);
      expect(steps[1]!.id).toBe('step2');
      expect(steps[1]!.isRequired).toBe(false);
    });

    it('custom steps have sequential order starting from 1', () => {
      const customSteps = [
        { id: 'a', title: 'A', required: true },
        { id: 'b', title: 'B', required: true },
        { id: 'c', title: 'C', required: false },
      ];

      const service = createService({ config: { workflowSteps: customSteps } });
      const steps = service.getWorkflowSteps();

      expect(steps[0]!.order).toBe(1);
      expect(steps[1]!.order).toBe(2);
      expect(steps[2]!.order).toBe(3);
    });
  });

  // --------------------------------------------------------------------------
  // validateRegistrationData
  // --------------------------------------------------------------------------

  describe('validateRegistrationData()', () => {
    it('returns valid for correct data', () => {
      const service = createService();
      const data = createValidRegistrationData();
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns schema errors for missing required fields', () => {
      const service = createService();
      const result = service.validateRegistrationData({});

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns schema error for invalid commodityType format', () => {
      const service = createService();
      const data = createValidRegistrationData({ commodityType: 'GOLD-123' });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns schema error for invalid producerId (not UUID)', () => {
      const service = createService();
      const data = createValidRegistrationData({ producerId: 'not-a-uuid' });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(false);
    });

    it('flags GPS accuracy exceeding configured maximum', () => {
      const service = createService({ config: { minGpsAccuracy: 10 } });
      const data = createValidRegistrationData({
        discoveryLocation: {
          latitude: 5.6037,
          longitude: -0.187,
          accuracy: 25,
          timestamp: Date.now(),
        },
      });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('GPS accuracy'))).toBe(true);
    });

    it('passes when GPS accuracy is within limits', () => {
      const service = createService({ config: { minGpsAccuracy: 10 } });
      const data = createValidRegistrationData({
        discoveryLocation: {
          latitude: 5.6037,
          longitude: -0.187,
          accuracy: 8,
          timestamp: Date.now(),
        },
      });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(true);
    });

    it('flags too few photos', () => {
      const service = createService({ config: { minPhotos: 3 } });
      const data = createValidRegistrationData({
        photos: [
          { uri: 'file:///photo1.jpg', timestamp: Date.now() },
          { uri: 'file:///photo2.jpg', timestamp: Date.now() },
        ],
      });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('photos required'))).toBe(true);
    });

    it('flags too many photos', () => {
      const service = createService({ config: { maxPhotos: 3 } });
      const photos = Array.from({ length: 5 }, (_, i) => ({
        uri: `file:///photo${i}.jpg`,
        timestamp: Date.now(),
      }));
      const data = createValidRegistrationData({ photos });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('photos allowed'))).toBe(true);
    });

    it('flags discovery date exceeding max age', () => {
      const service = createService({ config: { maxDiscoveryAgeDays: 7 } });
      const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      const data = createValidRegistrationData({ discoveryDate: oldDate });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('maximum age'))).toBe(true);
    });

    it('passes when discovery date is within max age', () => {
      const service = createService({ config: { maxDiscoveryAgeDays: 30 } });
      const recentDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      const data = createValidRegistrationData({ discoveryDate: recentDate });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(true);
    });

    it('warns on very large weight', () => {
      const service = createService();
      const data = createValidRegistrationData({ estimatedWeight: 15000 });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(true);
      expect(result.warnings!.some((w) => w.includes('Large weight'))).toBe(true);
    });

    it('does not warn on normal weight', () => {
      const service = createService();
      const data = createValidRegistrationData({ estimatedWeight: 500 });
      const result = service.validateRegistrationData(data);

      expect(result.warnings!.length).toBe(0);
    });

    it('warns on very high purity', () => {
      const service = createService();
      const data = createValidRegistrationData({ purity: 99.5 });
      const result = service.validateRegistrationData(data);

      expect(result.isValid).toBe(true);
      expect(result.warnings!.some((w) => w.includes('high purity'))).toBe(true);
    });

    it('does not warn on normal purity', () => {
      const service = createService();
      const data = createValidRegistrationData({ purity: 85 });
      const result = service.validateRegistrationData(data);

      expect(result.warnings!.some((w) => w.includes('purity'))).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // calculateProgress
  // --------------------------------------------------------------------------

  describe('calculateProgress()', () => {
    it('returns 0% for empty data', () => {
      const service = createService();
      const progress = service.calculateProgress({});

      expect(progress.percentage).toBe(0);
      expect(progress.completedSteps).toHaveLength(0);
      expect(progress.nextStep).toBe('location');
    });

    it('returns 25% when only location is provided', () => {
      const service = createService();
      const progress = service.calculateProgress({
        discoveryLocation: {
          latitude: 5.6037,
          longitude: -0.187,
          accuracy: 5,
          timestamp: Date.now(),
        },
      });

      expect(progress.percentage).toBe(25);
      expect(progress.completedSteps).toContain('location');
      expect(progress.nextStep).toBe('photos');
    });

    it('returns 50% when location and photos are provided', () => {
      const service = createService();
      const progress = service.calculateProgress({
        discoveryLocation: {
          latitude: 5.6037,
          longitude: -0.187,
          accuracy: 5,
          timestamp: Date.now(),
        },
        photos: [
          { uri: 'file:///p1.jpg', timestamp: Date.now() },
          { uri: 'file:///p2.jpg', timestamp: Date.now() },
        ],
      });

      expect(progress.percentage).toBe(50);
      expect(progress.completedSteps).toContain('location');
      expect(progress.completedSteps).toContain('photos');
    });

    it('returns 100% when all required data is provided', () => {
      const service = createService();
      const progress = service.calculateProgress({
        discoveryLocation: {
          latitude: 5.6037,
          longitude: -0.187,
          accuracy: 5,
          timestamp: Date.now(),
        },
        photos: [
          { uri: 'file:///p1.jpg', timestamp: Date.now() },
          { uri: 'file:///p2.jpg', timestamp: Date.now() },
        ],
        estimatedWeight: 250,
        commodityType: 'gold',
      });

      expect(progress.percentage).toBe(100);
      expect(progress.completedSteps).toContain('review');
      expect(progress.nextStep).toBeNull();
    });

    it('does not mark photos complete when below minimum', () => {
      const service = createService({ config: { minPhotos: 3 } });
      const progress = service.calculateProgress({
        photos: [
          { uri: 'file:///p1.jpg', timestamp: Date.now() },
          { uri: 'file:///p2.jpg', timestamp: Date.now() },
        ],
      });

      expect(progress.completedSteps).not.toContain('photos');
    });

    it('marks details complete only when both weight and commodityType present', () => {
      const service = createService();

      const noWeight = service.calculateProgress({ commodityType: 'gold' });
      expect(noWeight.completedSteps).not.toContain('details');

      const noType = service.calculateProgress({ estimatedWeight: 100 });
      expect(noType.completedSteps).not.toContain('details');
    });
  });

  // --------------------------------------------------------------------------
  // registerAssetLot
  // --------------------------------------------------------------------------

  describe('registerAssetLot()', () => {
    it('successfully registers valid asset lot', async () => {
      const mockStorage = createMockStorageService();
      const mockCrypto = createMockCryptoService();
      const service = createService({
        storageService: mockStorage,
        cryptoService: mockCrypto,
      });

      const data = createValidRegistrationData();
      const result = await service.registerAssetLot(data);

      expect(result).toBeDefined();
      expect(result.id).toBeTruthy();
      expect(result.commodityType).toBe('gold');
      expect(result.producerId).toBe(data.producerId);
      expect(result.weight).toBe(250);
      expect(result.weightUnit).toBe('g');
      expect(result.status).toBe('registered');
      expect(result.cryptoProof).toBe('mock-hash-abc123');
      expect(result.certificateId).toMatch(/^CERT-/);
    });

    it('calls cryptoService.createHash and sign', async () => {
      const mockCrypto = createMockCryptoService();
      const service = createService({ cryptoService: mockCrypto });

      await service.registerAssetLot(createValidRegistrationData());

      expect(mockCrypto.createHash).toHaveBeenCalledTimes(1);
      expect(mockCrypto.sign).toHaveBeenCalledWith('mock-hash-abc123');
    });

    it('stores asset lot and certificate', async () => {
      const mockStorage = createMockStorageService();
      const service = createService({ storageService: mockStorage });

      await service.registerAssetLot(createValidRegistrationData());

      expect(mockStorage.saveAssetLot).toHaveBeenCalledTimes(1);
      expect(mockStorage.saveCertificate).toHaveBeenCalledTimes(1);

      const savedLot = (mockStorage.saveAssetLot as ReturnType<typeof vi.fn>).mock.calls[0]![0];
      expect(savedLot.status).toBe('registered');

      const savedCert = (mockStorage.saveCertificate as ReturnType<typeof vi.fn>).mock.calls[0]![0];
      expect(savedCert.lotId).toBe(savedLot.id);
    });

    it('emits registration.started, registration.validated, and registration.completed events', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });

      await service.registerAssetLot(createValidRegistrationData());

      const eventTypes = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.map(
        (call) => call[0].type
      );
      expect(eventTypes).toContain('registration.started');
      expect(eventTypes).toContain('registration.validated');
      expect(eventTypes).toContain('registration.completed');
    });

    it('emits registration.failed event on validation failure', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });

      await expect(service.registerAssetLot({})).rejects.toThrow(/Validation failed/);

      const eventTypes = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.map(
        (call) => call[0].type
      );
      expect(eventTypes).toContain('registration.started');
      expect(eventTypes).toContain('registration.failed');
    });

    it('throws on schema validation failure', async () => {
      const service = createService();

      await expect(service.registerAssetLot({})).rejects.toThrow(/Validation failed/);
    });

    it('throws on business validation failure (e.g., GPS accuracy)', async () => {
      const service = createService({ config: { minGpsAccuracy: 5 } });
      const data = createValidRegistrationData({
        discoveryLocation: {
          latitude: 5.6037,
          longitude: -0.187,
          accuracy: 50,
          timestamp: Date.now(),
        },
      });

      await expect(service.registerAssetLot(data)).rejects.toThrow(/Business validation failed/);
    });

    it('maps quality to correct grade', async () => {
      const service = createService();

      const highQuality = await service.registerAssetLot(
        createValidRegistrationData({ quality: 'high' })
      );
      expect(highQuality.qualityGrade).toBe('A');

      const mediumQuality = await service.registerAssetLot(
        createValidRegistrationData({ quality: 'medium' })
      );
      expect(mediumQuality.qualityGrade).toBe('B');

      const lowQuality = await service.registerAssetLot(
        createValidRegistrationData({ quality: 'low' })
      );
      expect(lowQuality.qualityGrade).toBe('C');
    });

    it('generates lot ID with commodity prefix', async () => {
      const service = createService();
      const result = await service.registerAssetLot(createValidRegistrationData());

      expect(result.id).toMatch(/^GOL-/);
    });

    it('includes metadata with photos and session ID', async () => {
      const service = createService();
      const data = createValidRegistrationData();
      const result = await service.registerAssetLot(data);

      expect(result.metadata).toBeDefined();
      expect(result.metadata!['photos']).toHaveLength(2);
      expect(result.metadata!['registrationSessionId']).toBeTruthy();
      expect(result.metadata!['cryptoProof']).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // Crypto failure paths
  // --------------------------------------------------------------------------

  describe('Crypto failure paths', () => {
    it('sign throwing propagates error from registerAssetLot', async () => {
      const crypto = createMockCryptoService();
      (crypto.sign as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Signing key unavailable')
      );

      const service = createService({ cryptoService: crypto });

      await expect(service.registerAssetLot(createValidRegistrationData())).rejects.toThrow(
        'Signing key unavailable'
      );
      expect(crypto.createHash).toHaveBeenCalled();
      expect(crypto.sign).toHaveBeenCalled();
    });

    it('createHash throwing propagates error from registerAssetLot', async () => {
      const crypto = createMockCryptoService();
      (crypto.createHash as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Hash algorithm not supported')
      );

      const service = createService({ cryptoService: crypto });

      await expect(service.registerAssetLot(createValidRegistrationData())).rejects.toThrow(
        'Hash algorithm not supported'
      );
      expect(crypto.createHash).toHaveBeenCalled();
      // sign should never be reached since createHash fails first
      expect(crypto.sign).not.toHaveBeenCalled();
    });
  });
});
