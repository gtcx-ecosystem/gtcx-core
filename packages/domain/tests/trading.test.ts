import { describe, expect, it, vi } from 'vitest';

import { TradingService } from '../src/trading';
import type {
  AssetLot,
  IComplianceService,
  ICryptoService,
  IPriceService,
  IStorageService,
  Trader,
} from '../src/types';

const mockPriceService = (): IPriceService => ({
  getMarketPrice: vi.fn(async () => 100),
  getExchangeRate: vi.fn(async () => 1),
});

const mockComplianceService = (): IComplianceService => ({
  validateLicenses: vi.fn(async () => true),
  checkCompliance: vi.fn(async () => []),
});

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

const baseLot: AssetLot = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  commodityType: 'gold',
  discoveryLocation: {
    latitude: 1,
    longitude: 2,
    accuracy: 5,
    timestamp: Date.now(),
  },
  discoveryDate: new Date().toISOString(),
  producerId: '11111111-1111-4111-8111-111111111111',
  weight: 10,
  weightUnit: 'kg',
  status: 'registered',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const baseTrader: Trader = {
  id: '22222222-2222-4222-8222-222222222222',
  licenseNumber: 'LIC-123',
  name: 'Trader A',
  location: baseLot.discoveryLocation,
  verificationLevel: 'basic',
  roles: ['trader'],
};

class TestTradingService extends TradingService {
  protected async getAvailableAssetLots(): Promise<AssetLot[]> {
    return [baseLot];
  }

  protected async getTraderInfo(): Promise<Trader | undefined> {
    return baseTrader;
  }
}

describe('TradingService', () => {
  it('finds trading opportunities', async () => {
    const service = new TestTradingService(
      {
        priceService: mockPriceService(),
        complianceService: mockComplianceService(),
        cryptoService: mockCryptoService(),
        storageService: mockStorageService(),
      },
      {}
    );

    const opportunities = await service.findTradingOpportunities({ commodityType: 'gold' });

    expect(opportunities.length).toBe(1);
    expect(opportunities[0]?.assetLotId).toBe(baseLot.id);
    expect(opportunities[0]?.askPrice).toBeGreaterThan(0);
  });

  it('executes a trade and stores the transaction', async () => {
    const storage = mockStorageService();
    const service = new TestTradingService(
      {
        priceService: mockPriceService(),
        complianceService: mockComplianceService(),
        cryptoService: mockCryptoService(),
        storageService: storage,
      },
      {}
    );

    const tx = await service.executeTrade({
      assetLotId: baseLot.id,
      sellerId: baseTrader.id,
      buyerId: '33333333-3333-4333-8333-333333333333',
      quantity: 5,
      agreedPrice: 500,
      currency: 'USD',
      paymentMethod: 'cash',
      location: baseLot.discoveryLocation,
    });

    expect(tx.assetLotId).toBe(baseLot.id);
    expect(tx.price).toBe(500);
    expect(storage.saveTransaction).toHaveBeenCalledTimes(1);
  });
});
