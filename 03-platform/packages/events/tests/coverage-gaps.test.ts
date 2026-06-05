/**
 * @gtcx/events — Coverage gap tests
 */

import { describe, it, expect } from 'vitest';

import { TypedEventBus } from '../src/event-bus';
import { OfflineEventBuffer } from '../src/offline-buffer';
import { DomainEventFactory, InMemoryEventEmitter } from '../src/types';

describe('TypedEventBus — uncovered branches', () => {
  it('isOnline getter returns current state', () => {
    const bus = new TypedEventBus();
    expect(bus.isOnline).toBe(true);
    bus.goOffline();
    expect(bus.isOnline).toBe(false);
  });

  it('onAny returns no-op when bus is destroyed', () => {
    const bus = new TypedEventBus();
    bus.destroy();
    const unsubscribe = bus.onAny(() => {});
    expect(typeof unsubscribe).toBe('function');
    // Should not throw
    unsubscribe();
  });

  it('handles reentrant history writes', async () => {
    const bus = new TypedEventBus({ maxHistorySize: 10 });
    let emitted = false;
    bus.onAny(() => {
      if (!emitted) {
        emitted = true;
        bus.emit({
          type: 'registration.started',
          payload: {},
          timestamp: Date.now(),
          source: 'test',
          version: 1,
        });
      }
    });
    bus.emit({
      type: 'registration.started',
      payload: {},
      timestamp: Date.now(),
      source: 'test',
      version: 1,
    });
    await new Promise((r) => setTimeout(r, 10));
    expect(bus.getHistory().length).toBeGreaterThanOrEqual(1);
  });
});

describe('OfflineEventBuffer — console undefined branch', () => {
  it('buffers events without console', () => {
    const buffer = new OfflineEventBuffer({ maxBufferSize: 2 });
    const originalConsole = globalThis.console;
    // @ts-expect-error simulating no-console environment
    globalThis.console = undefined;
    try {
      buffer.buffer({
        type: 'test',
        payload: {},
        timestamp: Date.now(),
        source: 'test',
        version: 1,
      });
      buffer.buffer({
        type: 'test',
        payload: {},
        timestamp: Date.now(),
        source: 'test',
        version: 1,
      });
      buffer.buffer({
        type: 'test',
        payload: {},
        timestamp: Date.now(),
        source: 'test',
        version: 1,
      });
      expect(buffer.getBuffered().length).toBe(2);
    } finally {
      globalThis.console = originalConsole;
    }
  });
});

describe('DomainEventFactory — correlationId fallback', () => {
  it('uses factory correlationId when none provided', () => {
    const factory = new DomainEventFactory('test-trace');
    const event = factory.trading('trading.price_calculated', { price: 100 });
    expect(event.correlationId).toBe('test-trace');
  });
});

describe('TypedEventBus — handler already exists branch', () => {
  it('registers multiple handlers for same type', () => {
    const bus = new TypedEventBus();
    const calls: string[] = [];
    bus.on('registration.started', () => calls.push('a'));
    bus.on('registration.started', () => calls.push('b'));
    bus.emit({
      type: 'registration.started',
      payload: {},
      timestamp: Date.now(),
      source: 'test',
      version: 1,
    });
    expect(calls).toEqual(['a', 'b']);
  });
});

describe('InMemoryEventEmitter — handler already exists branch', () => {
  it('registers multiple handlers for same type', () => {
    const bus = new InMemoryEventEmitter();
    const calls: string[] = [];
    bus.on('registration.started', () => calls.push('a'));
    bus.on('registration.started', () => calls.push('b'));
    bus.emit({
      type: 'registration.started',
      payload: {},
      timestamp: Date.now(),
      source: 'test',
      version: 1,
    });
    expect(calls).toEqual(['a', 'b']);
  });
});
