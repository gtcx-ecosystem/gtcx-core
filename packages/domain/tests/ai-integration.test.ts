import { describe, it, expect } from 'vitest';

import { nullAIProvider, defaultAIHooks, AIContextBuilder } from '../src/ai-integration';
import type { OperationLogEntry } from '../src/ai-logging';
import type { DomainEvent } from '../src/events';
import type { AssetLot, Transaction, ComplianceRecord } from '../src/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLot(overrides: Partial<AssetLot> = {}): AssetLot {
  return {
    id: 'lot-1',
    commodityType: 'gold',
    discoveryLocation: { latitude: 0, longitude: 0, accuracy: 5, timestamp: Date.now() },
    discoveryDate: '2025-01-01',
    producerId: 'p-1',
    weight: 100,
    weightUnit: 'g',
    status: 'registered',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    ...overrides,
  } as AssetLot;
}

function makeTx(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx-1',
    assetLotId: 'lot-1',
    fromTraderId: 't-1',
    toTraderId: 't-2',
    quantity: 50,
    quantityUnit: 'g',
    price: 5000,
    currency: 'USD',
    timestamp: '2025-01-01',
    location: { latitude: 0, longitude: 0, accuracy: 5, timestamp: Date.now() },
    cryptoSignature: 'sig',
    status: 'completed',
    ...overrides,
  } as Transaction;
}

// ---------------------------------------------------------------------------
// nullAIProvider
// ---------------------------------------------------------------------------

describe('nullAIProvider', () => {
  it('analyzeRegistration returns zero confidence with default result', async () => {
    const res = await nullAIProvider.analyzeRegistration(makeLot());
    expect(res.type).toBe('registration_analysis');
    expect(res.confidence).toBe(0);
    expect(res.result.qualityAssessment).toBe('medium');
    expect(res.result.priceEstimate).toEqual({ min: 0, max: 0, expected: 0 });
    expect(res.result.riskFactors).toEqual([]);
    expect(res.timestamp).toBeTypeOf('number');
  });

  it('analyzeTrade returns hold recommendation', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await nullAIProvider.analyzeTrade({} as any);
    expect(res.type).toBe('trade_analysis');
    expect(res.result.recommendation).toBe('hold');
    expect(res.result.riskLevel).toBe('medium');
  });

  it('analyzeCompliance returns stable trend', async () => {
    const res = await nullAIProvider.analyzeCompliance([]);
    expect(res.type).toBe('compliance_analysis');
    expect(res.result.trendDirection).toBe('stable');
    expect(res.result.riskAreas).toEqual([]);
  });

  it('detectFraud returns zero risk', async () => {
    const res = await nullAIProvider.detectFraud([]);
    expect(res.type).toBe('fraud_detection');
    expect(res.result.riskScore).toBe(0);
    expect(res.result.suspiciousTransactions).toEqual([]);
  });

  it('generateInsights returns empty arrays', async () => {
    const res = await nullAIProvider.generateInsights([]);
    expect(res.type).toBe('insights');
    expect(res.result.performanceInsights).toEqual([]);
    expect(res.result.optimizationSuggestions).toEqual([]);
    expect(res.result.alertConditions).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// defaultAIHooks
// ---------------------------------------------------------------------------

describe('defaultAIHooks', () => {
  it('onBeforeRegistration returns proceed: true', async () => {
    const res = await defaultAIHooks.onBeforeRegistration!({});
    expect(res).toEqual({ proceed: true });
  });

  it('onAfterRegistration resolves without error', async () => {
    await expect(defaultAIHooks.onAfterRegistration!(makeLot())).resolves.toBeUndefined();
  });

  it('onBeforeTrade returns proceed: true', async () => {
    const res = await defaultAIHooks.onBeforeTrade!({});
    expect(res).toEqual({ proceed: true });
  });

  it('onAfterTrade resolves without error', async () => {
    await expect(defaultAIHooks.onAfterTrade!(makeTx())).resolves.toBeUndefined();
  });

  it('onComplianceViolation returns escalate: false', async () => {
    const res = await defaultAIHooks.onComplianceViolation!({} as ComplianceRecord);
    expect(res).toEqual({ escalate: false });
  });

  it('onAnalysisCycle returns empty array', async () => {
    const res = await defaultAIHooks.onAnalysisCycle!();
    expect(res).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// AIContextBuilder
// ---------------------------------------------------------------------------

describe('AIContextBuilder', () => {
  it('builds context with default operation', () => {
    const ctx = new AIContextBuilder().build();
    expect(ctx.operation).toBe('unknown');
    expect(ctx.entities).toEqual({});
  });

  it('sets operation', () => {
    const ctx = new AIContextBuilder().operation('register').build();
    expect(ctx.operation).toBe('register');
  });

  it('supports fluent chaining', () => {
    const builder = new AIContextBuilder();
    const same = builder.operation('test');
    expect(same).toBe(builder);
  });

  it('adds asset lots', () => {
    const lots = [makeLot()];
    const ctx = new AIContextBuilder().withAssetLots(lots).build();
    expect(ctx.entities.assetLots).toBe(lots);
  });

  it('adds transactions', () => {
    const txs = [makeTx()];
    const ctx = new AIContextBuilder().withTransactions(txs).build();
    expect(ctx.entities.transactions).toBe(txs);
  });

  it('adds compliance records', () => {
    const records = [{ id: 'cr-1' } as ComplianceRecord];
    const ctx = new AIContextBuilder().withComplianceRecords(records).build();
    expect(ctx.entities.complianceRecords).toBe(records);
  });

  it('adds market context', () => {
    const market = {
      commodityType: 'gold',
      currentPrice: 60,
      priceHistory: [{ timestamp: 1, price: 55 }],
      volatility: 0.1,
    };
    const ctx = new AIContextBuilder().withMarket(market).build();
    expect(ctx.market).toBe(market);
  });

  it('adds user context', () => {
    const user = { id: 'u-1', role: 'admin' };
    const ctx = new AIContextBuilder().withUser(user).build();
    expect(ctx.user).toBe(user);
  });

  it('withHistory filters events by time range', () => {
    const now = Date.now();
    const recent: DomainEvent = {
      type: 'registration.started',
      payload: {},
      timestamp: now - 1000,
      source: 'registration',
      version: 1,
    };
    const old: DomainEvent = {
      type: 'registration.started',
      payload: {},
      timestamp: now - 30 * 24 * 60 * 60 * 1000,
      source: 'registration',
      version: 1,
    };
    const op: OperationLogEntry = {
      operationId: 'op-1',
      type: 'registration.validate',
      status: 'success',
      startTime: now - 500,
    };
    const oldOp: OperationLogEntry = {
      operationId: 'op-2',
      type: 'registration.validate',
      status: 'success',
      startTime: now - 30 * 24 * 60 * 60 * 1000,
    };

    const ctx = new AIContextBuilder().withHistory([recent, old], [op, oldOp], 7).build();

    expect(ctx.history!.events).toHaveLength(1);
    expect(ctx.history!.events[0]).toBe(recent);
    expect(ctx.history!.operations).toHaveLength(1);
    expect(ctx.history!.operations[0]).toBe(op);
    expect(ctx.history!.timeRange.end).toBeGreaterThan(ctx.history!.timeRange.start);
  });

  it('withHistory defaults to 7 days', () => {
    const ctx = new AIContextBuilder().withHistory([], []).build();
    const days7 = 7 * 24 * 60 * 60 * 1000;
    const diff = ctx.history!.timeRange.end - ctx.history!.timeRange.start;
    // Allow 100ms tolerance for execution time
    expect(Math.abs(diff - days7)).toBeLessThan(100);
  });

  it('combines multiple entity types', () => {
    const lots = [makeLot()];
    const txs = [makeTx()];
    const ctx = new AIContextBuilder().withAssetLots(lots).withTransactions(txs).build();
    expect(ctx.entities.assetLots).toBe(lots);
    expect(ctx.entities.transactions).toBe(txs);
  });
});
