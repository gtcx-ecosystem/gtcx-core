/**
 * Integration: TypedEventBus with DomainEventFactory + offline buffering
 *
 * Verifies that @gtcx/events and @gtcx/domain work together end-to-end:
 * typed event emission, handler routing, offline buffer/flush, history, and error handling.
 */

import { DomainEventFactory } from '@gtcx/domain';
import type { DomainEvent, RegistrationCompletedPayload, TradeExecutedPayload } from '@gtcx/domain';
import { TypedEventBus } from '@gtcx/events';
import { describe, it, expect, vi } from 'vitest';

describe('Integration: TypedEventBus + DomainEventFactory', () => {
  function createFactory(correlationId?: string) {
    return new DomainEventFactory(correlationId);
  }

  it('routes typed registration events to correct handlers', () => {
    const bus = new TypedEventBus();
    const factory = createFactory('corr-001');
    const received: DomainEvent[] = [];

    bus.on('registration.completed', (event) => received.push(event));

    const event = factory.registration<RegistrationCompletedPayload>('registration.completed', {
      sessionId: 'sess-1',
      assetLotId: 'lot-1',
      commodityType: 'gold',
      producerId: 'prod-1',
      certificateId: 'cert-1',
      weight: 100,
      weightUnit: 'g',
      proofHash: 'abc123',
    });

    bus.emit(event);

    expect(received).toHaveLength(1);
    expect(received[0]!.type).toBe('registration.completed');
    expect(received[0]!.correlationId).toBe('corr-001');
    expect(received[0]!.source).toBe('registration');
    expect((received[0]!.payload as RegistrationCompletedPayload).assetLotId).toBe('lot-1');
  });

  it('does not cross-deliver events between types', () => {
    const bus = new TypedEventBus();
    const factory = createFactory();
    const tradingHandler = vi.fn();
    const complianceHandler = vi.fn();

    bus.on('trading.trade_executed', tradingHandler);
    bus.on('compliance.check_completed', complianceHandler);

    bus.emit(factory.trading('trading.trade_executed', { transactionId: 'tx-1' }));

    expect(tradingHandler).toHaveBeenCalledTimes(1);
    expect(complianceHandler).not.toHaveBeenCalled();
  });

  it('global handlers receive all event types', () => {
    const bus = new TypedEventBus();
    const factory = createFactory();
    const allEvents: DomainEvent[] = [];

    bus.onAny((event) => allEvents.push(event));

    bus.emit(
      factory.registration('registration.started', {
        sessionId: 's1',
        commodityType: 'gold',
        producerId: 'p1',
      })
    );
    bus.emit(factory.trading('trading.price_calculated', { assetLotId: 'lot-1' }));
    bus.emit(factory.compliance('compliance.check_started', { checkId: 'chk-1' }));

    expect(allEvents).toHaveLength(3);
    expect(allEvents.map((e) => e.source)).toEqual(['registration', 'trading', 'compliance']);
  });

  it('buffers events offline and flushes on reconnect', async () => {
    const bus = new TypedEventBus({ enableOfflineBuffer: true });
    const factory = createFactory('corr-offline');
    const received: DomainEvent[] = [];

    bus.on('registration.completed', (event) => received.push(event));

    // Go offline
    bus.goOffline();
    expect(bus.isOnline).toBe(false);

    // Emit while offline — should not reach handler
    bus.emit(
      factory.registration<RegistrationCompletedPayload>('registration.completed', {
        sessionId: 'sess-offline',
        assetLotId: 'lot-offline',
        commodityType: 'cobalt',
        producerId: 'prod-2',
        certificateId: 'cert-2',
        weight: 50,
        weightUnit: 'kg',
        proofHash: 'def456',
      })
    );

    expect(received).toHaveLength(0);

    // Go online — flush should deliver buffered events
    const flushed = await bus.goOnline();
    expect(flushed).toBe(1);
    expect(received).toHaveLength(1);
    expect((received[0]!.payload as RegistrationCompletedPayload).assetLotId).toBe('lot-offline');
  });

  it('records events in history while online and offline', async () => {
    const bus = new TypedEventBus({ maxHistorySize: 100 });
    const factory = createFactory();

    bus.emit(factory.trading('trading.trade_initiated', { id: '1' }));
    bus.goOffline();
    bus.emit(factory.trading('trading.trade_executed', { id: '2' }));
    await bus.goOnline();
    bus.emit(factory.trading('trading.settlement_completed', { id: '3' }));

    const allHistory = bus.getHistory();
    // All 3 should be in history (online, offline, and post-flush)
    expect(allHistory.length).toBeGreaterThanOrEqual(3);

    const tradingHistory = bus.getHistory('trading.trade_executed');
    expect(tradingHistory).toHaveLength(1);
  });

  it('calls onHandlerError when a handler throws', () => {
    const errors: { error: unknown; eventType: string }[] = [];
    const bus = new TypedEventBus({
      onHandlerError: (error, event) => {
        errors.push({ error, eventType: event.type });
      },
    });
    const factory = createFactory();

    bus.on('compliance.violation_detected', () => {
      throw new Error('handler boom');
    });

    // Should not throw — error is caught and reported
    expect(() => {
      bus.emit(factory.compliance('compliance.violation_detected', { violationId: 'v-1' }));
    }).not.toThrow();

    expect(errors).toHaveLength(1);
    expect(errors[0]!.eventType).toBe('compliance.violation_detected');
    expect((errors[0]!.error as Error).message).toBe('handler boom');
  });

  it('once handler fires exactly once', () => {
    const bus = new TypedEventBus();
    const factory = createFactory();
    const handler = vi.fn();

    bus.once('trading.trade_executed', handler);

    bus.emit(
      factory.trading<TradeExecutedPayload>('trading.trade_executed', {
        transactionId: 'tx-1',
        assetLotId: 'lot-1',
        sellerId: 's1',
        buyerId: 'b1',
        quantity: 10,
        quantityUnit: 'oz',
        finalPrice: 1800,
        currency: 'USD',
        paymentMethod: 'wire',
        proofHash: 'h',
      })
    );
    bus.emit(
      factory.trading<TradeExecutedPayload>('trading.trade_executed', {
        transactionId: 'tx-2',
        assetLotId: 'lot-2',
        sellerId: 's2',
        buyerId: 'b2',
        quantity: 20,
        quantityUnit: 'oz',
        finalPrice: 1900,
        currency: 'USD',
        paymentMethod: 'wire',
        proofHash: 'h2',
      })
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]![0].payload.transactionId).toBe('tx-1');
  });

  it('destroyed bus stops emitting', () => {
    const bus = new TypedEventBus();
    const factory = createFactory();
    const handler = vi.fn();

    bus.on('registration.started', handler);
    bus.destroy();

    bus.emit(factory.registration('registration.started', { sessionId: 's1' }));
    expect(handler).not.toHaveBeenCalled();
    expect(bus.isDestroyed).toBe(true);
  });
});
