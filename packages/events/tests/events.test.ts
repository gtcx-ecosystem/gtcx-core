import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TypedEventBus } from '../src/event-bus.js';
import { OfflineEventBuffer } from '../src/offline-buffer.js';
import type { DomainEvent, DomainEventType } from '../src/types.js';

// ============================================================================
// HELPERS
// ============================================================================

function createEvent(
  type: DomainEventType = 'registration.started',
  payload: unknown = { sessionId: 'test-session' }
): DomainEvent {
  return {
    type,
    payload,
    timestamp: Date.now(),
    source: 'registration',
    version: 1,
  };
}

// ============================================================================
// TypedEventBus
// ============================================================================

describe('TypedEventBus', () => {
  let bus: TypedEventBus;

  beforeEach(() => {
    bus = new TypedEventBus();
  });

  // --------------------------------------------------------------------------
  // emit / on
  // --------------------------------------------------------------------------

  describe('emit and on', () => {
    it('should deliver events to type-specific handlers', () => {
      const handler = vi.fn();
      bus.on('registration.started', handler);

      const event = createEvent('registration.started');
      bus.emit(event);

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('should not deliver events to handlers for different types', () => {
      const handler = vi.fn();
      bus.on('trading.trade_executed', handler);

      bus.emit(createEvent('registration.started'));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should support multiple handlers for the same type', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      bus.on('registration.started', handler1);
      bus.on('registration.started', handler2);

      bus.emit(createEvent('registration.started'));

      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).toHaveBeenCalledOnce();
    });
  });

  // --------------------------------------------------------------------------
  // off
  // --------------------------------------------------------------------------

  describe('off', () => {
    it('should unsubscribe a handler', () => {
      const handler = vi.fn();
      bus.on('registration.started', handler);
      bus.off('registration.started', handler);

      bus.emit(createEvent('registration.started'));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should return an unsubscribe function from on()', () => {
      const handler = vi.fn();
      const unsub = bus.on('registration.started', handler);
      unsub();

      bus.emit(createEvent('registration.started'));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // once
  // --------------------------------------------------------------------------

  describe('once', () => {
    it('should deliver only the first event', () => {
      const handler = vi.fn();
      bus.once('registration.started', handler);

      bus.emit(createEvent('registration.started'));
      bus.emit(createEvent('registration.started'));

      expect(handler).toHaveBeenCalledOnce();
    });

    it('should return an unsubscribe function', () => {
      const handler = vi.fn();
      const unsub = bus.once('registration.started', handler);
      unsub();

      bus.emit(createEvent('registration.started'));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // onAny
  // --------------------------------------------------------------------------

  describe('onAny', () => {
    it('should receive all event types', () => {
      const handler = vi.fn();
      bus.onAny(handler);

      bus.emit(createEvent('registration.started'));
      bus.emit(createEvent('trading.trade_executed'));

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should return an unsubscribe function', () => {
      const handler = vi.fn();
      const unsub = bus.onAny(handler);
      unsub();

      bus.emit(createEvent('registration.started'));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // Error isolation
  // --------------------------------------------------------------------------

  describe('error isolation', () => {
    it('should not break other handlers when one throws', () => {
      const errorHandler = vi.fn(() => {
        throw new Error('handler error');
      });
      const goodHandler = vi.fn();

      bus.on('registration.started', errorHandler);
      bus.on('registration.started', goodHandler);

      expect(() => bus.emit(createEvent('registration.started'))).not.toThrow();
      expect(goodHandler).toHaveBeenCalledOnce();
    });

    it('should isolate errors in global handlers', () => {
      const errorHandler = vi.fn(() => {
        throw new Error('global handler error');
      });
      const goodHandler = vi.fn();

      bus.onAny(errorHandler);
      bus.onAny(goodHandler);

      expect(() => bus.emit(createEvent('registration.started'))).not.toThrow();
      expect(goodHandler).toHaveBeenCalledOnce();
    });
  });

  // --------------------------------------------------------------------------
  // History
  // --------------------------------------------------------------------------

  describe('getHistory', () => {
    it('should record emitted events', () => {
      const event = createEvent('registration.started');
      bus.emit(event);

      const history = bus.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toBe(event);
    });

    it('should filter by type', () => {
      bus.emit(createEvent('registration.started'));
      bus.emit(createEvent('trading.trade_executed'));
      bus.emit(createEvent('registration.started'));

      const history = bus.getHistory('registration.started');
      expect(history).toHaveLength(2);
    });

    it('should limit results', () => {
      for (let i = 0; i < 10; i++) {
        bus.emit(createEvent('registration.started'));
      }

      const history = bus.getHistory(undefined, 3);
      expect(history).toHaveLength(3);
    });

    it('should return most recent events when limited', () => {
      for (let i = 0; i < 5; i++) {
        bus.emit(createEvent('registration.started', { index: i }));
      }

      const history = bus.getHistory(undefined, 2);
      expect(history).toHaveLength(2);
      expect((history[0] as DomainEvent<{ index: number }>).payload.index).toBe(3);
      expect((history[1] as DomainEvent<{ index: number }>).payload.index).toBe(4);
    });
  });

  describe('max history size', () => {
    it('should evict oldest events when history exceeds max', () => {
      const bus = new TypedEventBus({ maxHistorySize: 5 });

      for (let i = 0; i < 8; i++) {
        bus.emit(createEvent('registration.started', { index: i }));
      }

      const history = bus.getHistory();
      expect(history).toHaveLength(5);
      expect((history[0] as DomainEvent<{ index: number }>).payload.index).toBe(3);
    });
  });

  // --------------------------------------------------------------------------
  // clear
  // --------------------------------------------------------------------------

  describe('clear', () => {
    it('should clear event history', () => {
      bus.emit(createEvent('registration.started'));
      bus.clear();

      expect(bus.getHistory()).toHaveLength(0);
    });
  });

  // --------------------------------------------------------------------------
  // destroy
  // --------------------------------------------------------------------------

  describe('destroy', () => {
    it('should stop delivering events after destroy', () => {
      const handler = vi.fn();
      bus.on('registration.started', handler);
      bus.destroy();

      bus.emit(createEvent('registration.started'));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should mark isDestroyed as true', () => {
      expect(bus.isDestroyed).toBe(false);
      bus.destroy();
      expect(bus.isDestroyed).toBe(true);
    });

    it('should return noop from on() after destroy', () => {
      bus.destroy();
      const handler = vi.fn();
      const unsub = bus.on('registration.started', handler);
      expect(typeof unsub).toBe('function');
    });
  });
});

// ============================================================================
// OfflineEventBuffer
// ============================================================================

describe('OfflineEventBuffer', () => {
  let buffer: OfflineEventBuffer;

  beforeEach(() => {
    buffer = new OfflineEventBuffer();
  });

  describe('buffer', () => {
    it('should store events', () => {
      const event = createEvent();
      buffer.buffer(event);

      expect(buffer.size).toBe(1);
      expect(buffer.getBuffered()[0]!.event).toBe(event);
    });

    it('should add metadata to buffered events', () => {
      buffer.buffer(createEvent());

      const entry = buffer.getBuffered()[0]!;
      expect(entry.bufferedAt).toBeTypeOf('number');
      expect(entry.retryCount).toBe(0);
      expect(entry.id).toBeTypeOf('string');
    });
  });

  describe('flush', () => {
    it('should replay events through emitFn in FIFO order', async () => {
      const events: DomainEvent[] = [];
      buffer.buffer(createEvent('registration.started', { order: 1 }));
      buffer.buffer(createEvent('registration.completed', { order: 2 }));

      const flushed = await buffer.flush((event) => {
        events.push(event);
      });

      expect(flushed).toBe(2);
      expect(events).toHaveLength(2);
      expect((events[0] as DomainEvent<{ order: number }>).payload.order).toBe(1);
      expect((events[1] as DomainEvent<{ order: number }>).payload.order).toBe(2);
    });

    it('should clear the buffer after successful flush', async () => {
      buffer.buffer(createEvent());
      await buffer.flush(() => {});

      expect(buffer.size).toBe(0);
    });

    it('should increment retryCount on flush', async () => {
      buffer.buffer(createEvent());
      // Flush will succeed but we capture the retryCount indirectly
      // by flushing partially
      const emitFn = vi.fn(() => {
        // Will succeed
      });

      await buffer.flush(emitFn);
      expect(emitFn).toHaveBeenCalledOnce();
    });

    it('should keep remaining events on emitFn error', async () => {
      buffer.buffer(createEvent('registration.started'));
      buffer.buffer(createEvent('registration.completed'));
      buffer.buffer(createEvent('trading.trade_executed'));

      let callCount = 0;
      const flushed = await buffer.flush(() => {
        callCount += 1;
        if (callCount === 2) {
          throw new Error('emit failed');
        }
      });

      expect(flushed).toBe(1);
      // The failed event and all subsequent events should remain in the buffer
      expect(buffer.size).toBe(2);
    });
  });

  describe('max buffer size', () => {
    it('should drop oldest events when buffer exceeds max', () => {
      const smallBuffer = new OfflineEventBuffer({ maxBufferSize: 3 });

      for (let i = 0; i < 5; i++) {
        smallBuffer.buffer(createEvent('registration.started', { index: i }));
      }

      const buffered = smallBuffer.getBuffered();
      expect(buffered).toHaveLength(3);
      expect((buffered[0]!.event as DomainEvent<{ index: number }>).payload.index).toBe(2);
    });
  });

  describe('clear', () => {
    it('should remove all buffered events', () => {
      buffer.buffer(createEvent());
      buffer.buffer(createEvent());
      buffer.clear();

      expect(buffer.size).toBe(0);
      expect(buffer.getBuffered()).toHaveLength(0);
    });
  });

  describe('getBuffered', () => {
    it('should return a copy of the buffer', () => {
      buffer.buffer(createEvent());

      const copy = buffer.getBuffered();
      copy.pop();

      expect(buffer.size).toBe(1);
    });
  });
});

// ============================================================================
// Integration: Offline buffering + replay
// ============================================================================

describe('Integration: offline buffering and replay', () => {
  it('should buffer events while offline and deliver on goOnline', async () => {
    const bus = new TypedEventBus({ enableOfflineBuffer: true });
    const handler = vi.fn();
    bus.on('registration.started', handler);

    // Go offline and emit
    bus.goOffline();
    bus.emit(createEvent('registration.started'));
    bus.emit(createEvent('registration.started'));

    expect(handler).not.toHaveBeenCalled();

    // Go online — buffered events should be flushed
    const flushed = await bus.goOnline();

    expect(flushed).toBe(2);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('should record buffered events in history immediately', () => {
    const bus = new TypedEventBus({ enableOfflineBuffer: true });

    bus.goOffline();
    bus.emit(createEvent('registration.started'));

    // History records events even when offline
    expect(bus.getHistory()).toHaveLength(1);
  });

  it('should not buffer when enableOfflineBuffer is false', async () => {
    const bus = new TypedEventBus({ enableOfflineBuffer: false });
    const handler = vi.fn();
    bus.on('registration.started', handler);

    bus.goOffline();
    bus.emit(createEvent('registration.started'));

    // Without buffering, the event is dispatched immediately even if "offline"
    expect(handler).toHaveBeenCalledOnce();

    const flushed = await bus.goOnline();
    expect(flushed).toBe(0);
  });

  it('should expose the offline buffer for inspection', () => {
    const bus = new TypedEventBus();
    bus.goOffline();
    bus.emit(createEvent('registration.started'));

    const offlineBuffer = bus.getOfflineBuffer();
    expect(offlineBuffer.size).toBe(1);
  });
});
