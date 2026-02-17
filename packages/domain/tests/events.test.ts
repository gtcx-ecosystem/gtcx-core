import { describe, it, expect, vi, beforeEach } from 'vitest';

import { DomainEventFactory, InMemoryEventEmitter, nullEventEmitter } from '../src/events';
import type { DomainEvent, DomainEventType } from '../src/events';

// ---------------------------------------------------------------------------
// DomainEventFactory
// ---------------------------------------------------------------------------

describe('DomainEventFactory', () => {
  it('creates factory without correlationId', () => {
    const f = new DomainEventFactory();
    expect(f.getCorrelationId()).toBeUndefined();
  });

  it('creates factory with correlationId', () => {
    const f = new DomainEventFactory('corr-1');
    expect(f.getCorrelationId()).toBe('corr-1');
  });

  it('setCorrelationId updates the id', () => {
    const f = new DomainEventFactory();
    f.setCorrelationId('corr-2');
    expect(f.getCorrelationId()).toBe('corr-2');
  });

  describe('registration()', () => {
    it('creates a registration event with correct fields', () => {
      const f = new DomainEventFactory('corr-1');
      const event = f.registration('registration.started', {
        sessionId: 's1',
        commodityType: 'gold',
        producerId: 'p1',
      });

      expect(event.type).toBe('registration.started');
      expect(event.source).toBe('registration');
      expect(event.version).toBe(1);
      expect(event.correlationId).toBe('corr-1');
      expect(event.timestamp).toBeTypeOf('number');
      expect(event.payload.sessionId).toBe('s1');
    });
  });

  describe('trading()', () => {
    it('creates a trading event', () => {
      const f = new DomainEventFactory();
      const event = f.trading('trading.price_calculated', {
        assetLotId: 'lot-1',
        commodityType: 'gold',
        basePrice: 50,
        adjustedPrice: 55,
        currency: 'USD',
        adjustments: { form: 1, purity: 2, quality: 1, location: 1 },
      });

      expect(event.type).toBe('trading.price_calculated');
      expect(event.source).toBe('trading');
      expect(event.version).toBe(1);
      expect(event.correlationId).toBeUndefined();
    });
  });

  describe('compliance()', () => {
    it('creates a compliance event', () => {
      const f = new DomainEventFactory('c-99');
      const event = f.compliance('compliance.check_started', {
        checkId: 'chk-1',
        entityId: 'e-1',
        entityType: 'asset_lot',
        jurisdiction: 'GH',
      });

      expect(event.type).toBe('compliance.check_started');
      expect(event.source).toBe('compliance');
      expect(event.correlationId).toBe('c-99');
    });
  });
});

// ---------------------------------------------------------------------------
// InMemoryEventEmitter
// ---------------------------------------------------------------------------

describe('InMemoryEventEmitter', () => {
  let emitter: InMemoryEventEmitter;

  beforeEach(() => {
    emitter = new InMemoryEventEmitter();
  });

  function makeEvent(type: DomainEventType, payload: unknown = {}): DomainEvent {
    return {
      type,
      payload,
      timestamp: Date.now(),
      source: 'registration',
      version: 1,
    };
  }

  it('stores emitted events', () => {
    const e = makeEvent('registration.started');
    emitter.emit(e);
    expect(emitter.getEvents()).toHaveLength(1);
    expect(emitter.getEvents()[0]).toEqual(e);
  });

  it('notifies type-specific handlers', () => {
    const handler = vi.fn();
    emitter.on('registration.started', handler);

    const e = makeEvent('registration.started');
    emitter.emit(e);

    expect(handler).toHaveBeenCalledWith(e);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not notify handler for different event types', () => {
    const handler = vi.fn();
    emitter.on('registration.started', handler);

    emitter.emit(makeEvent('trading.price_calculated'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('notifies global handlers for all events', () => {
    const handler = vi.fn();
    emitter.onAny(handler);

    emitter.emit(makeEvent('registration.started'));
    emitter.emit(makeEvent('trading.trade_executed'));

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('on() returns unsubscribe function', () => {
    const handler = vi.fn();
    const unsub = emitter.on('registration.started', handler);

    emitter.emit(makeEvent('registration.started'));
    expect(handler).toHaveBeenCalledTimes(1);

    unsub();

    emitter.emit(makeEvent('registration.started'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('onAny() returns unsubscribe function', () => {
    const handler = vi.fn();
    const unsub = emitter.onAny(handler);

    emitter.emit(makeEvent('registration.started'));
    expect(handler).toHaveBeenCalledTimes(1);

    unsub();

    emitter.emit(makeEvent('registration.started'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('getEventsByType filters correctly', () => {
    emitter.emit(makeEvent('registration.started'));
    emitter.emit(makeEvent('registration.started'));
    emitter.emit(makeEvent('trading.price_calculated'));

    expect(emitter.getEventsByType('registration.started')).toHaveLength(2);
    expect(emitter.getEventsByType('trading.price_calculated')).toHaveLength(1);
    expect(emitter.getEventsByType('compliance.check_started')).toHaveLength(0);
  });

  it('clear removes all stored events', () => {
    emitter.emit(makeEvent('registration.started'));
    emitter.emit(makeEvent('trading.price_calculated'));
    emitter.clear();
    expect(emitter.getEvents()).toHaveLength(0);
  });

  it('supports multiple handlers for same event type', () => {
    const h1 = vi.fn();
    const h2 = vi.fn();
    emitter.on('registration.started', h1);
    emitter.on('registration.started', h2);

    emitter.emit(makeEvent('registration.started'));

    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// nullEventEmitter
// ---------------------------------------------------------------------------

describe('nullEventEmitter', () => {
  it('emit does not throw', () => {
    expect(() =>
      nullEventEmitter.emit({
        type: 'registration.started',
        payload: {},
        timestamp: Date.now(),
        source: 'registration',
        version: 1,
      })
    ).not.toThrow();
  });

  it('on returns an unsubscribe function', () => {
    const unsub = nullEventEmitter.on('registration.started', () => {});
    expect(unsub).toBeTypeOf('function');
    unsub(); // should not throw
  });

  it('onAny returns an unsubscribe function', () => {
    const unsub = nullEventEmitter.onAny(() => {});
    expect(unsub).toBeTypeOf('function');
    unsub();
  });
});
