/**
 * TypedEventBus
 *
 * Core event bus implementing IDomainEventEmitter from @gtcx/domain
 * with typed subscriptions, offline buffering, event history, and
 * error isolation between handlers.
 *
 * @package @gtcx/events
 */

import type { DomainEvent, DomainEventType, IDomainEventEmitter } from '@gtcx/domain';

import { OfflineEventBuffer } from './offline-buffer.js';
import type { EventBusOptions, EventHandler } from './types.js';

// ============================================================================
// TYPED EVENT BUS
// ============================================================================

export class TypedEventBus implements IDomainEventEmitter {
  private handlers: Map<DomainEventType, Set<EventHandler>> = new Map();
  private globalHandlers: Set<EventHandler> = new Set();
  private history: DomainEvent[] = [];
  private historyHead: number = 0;
  private historyCount: number = 0;
  private readonly maxHistorySize: number;
  private readonly offlineBuffer: OfflineEventBuffer;
  private readonly enableOfflineBuffer: boolean;
  private readonly onHandlerError?: (error: unknown, event: DomainEvent) => void;
  private _isOnline: boolean = true;
  private _isDestroyed: boolean = false;

  constructor(options?: EventBusOptions) {
    this.maxHistorySize = options?.maxHistorySize ?? 1000;
    this.enableOfflineBuffer = options?.enableOfflineBuffer ?? true;
    this.onHandlerError = options?.onHandlerError;
    this.offlineBuffer = new OfflineEventBuffer({
      maxBufferSize: options?.maxBufferSize ?? 5000,
    });
  }

  // --------------------------------------------------------------------------
  // Online/Offline state
  // --------------------------------------------------------------------------

  /** Whether the bus is currently online (dispatching events). */
  get isOnline(): boolean {
    return this._isOnline;
  }

  /**
   * Set the bus to online mode. If offline buffering is enabled,
   * buffered events are flushed automatically.
   */
  async goOnline(): Promise<number> {
    this._isOnline = true;
    if (this.enableOfflineBuffer) {
      return this.offlineBuffer.flush((event) => this.dispatchToHandlers(event));
    }
    return 0;
  }

  /** Set the bus to offline mode. Events will be buffered instead of dispatched. */
  goOffline(): void {
    this._isOnline = false;
  }

  // --------------------------------------------------------------------------
  // IDomainEventEmitter implementation
  // --------------------------------------------------------------------------

  /**
   * Emit a domain event.
   * If online, dispatches to handlers immediately.
   * If offline and buffering is enabled, stores for later replay.
   */
  emit(event: DomainEvent): void {
    if (this._isDestroyed) {
      return;
    }

    // Always record in history
    this.addToHistory(event);

    if (!this._isOnline && this.enableOfflineBuffer) {
      this.offlineBuffer.buffer(event);
      return;
    }

    this.dispatchToHandlers(event);
  }

  /**
   * Subscribe to a specific event type.
   * Returns an unsubscribe function (IDomainEventEmitter contract)
   * and also provides an EventSubscription object.
   */
  on(type: DomainEventType, handler: EventHandler): () => void {
    if (this._isDestroyed) {
      return () => {};
    }

    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    const unsubscribe = () => {
      this.handlers.get(type)?.delete(handler);
    };
    return unsubscribe;
  }

  /**
   * Subscribe to all events.
   * Returns an unsubscribe function.
   */
  onAny(handler: EventHandler): () => void {
    if (this._isDestroyed) {
      return () => {};
    }

    this.globalHandlers.add(handler);

    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  /**
   * Unsubscribe a handler from a specific event type.
   */
  off(type: DomainEventType, handler: EventHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  /**
   * Subscribe to a specific event type for one-time delivery.
   * The handler is automatically removed after its first invocation.
   */
  once(type: DomainEventType, handler: EventHandler): () => void {
    const wrappedHandler: EventHandler = (event) => {
      this.off(type, wrappedHandler);
      handler(event);
    };
    return this.on(type, wrappedHandler);
  }

  // --------------------------------------------------------------------------
  // History
  // --------------------------------------------------------------------------

  /**
   * Retrieve past events, optionally filtered by type and limited in count.
   */
  getHistory(type?: DomainEventType, limit?: number): DomainEvent[] {
    // Reconstruct ordered array from ring buffer
    let ordered: DomainEvent[];
    if (this.historyCount < this.maxHistorySize) {
      ordered = [...this.history];
    } else {
      ordered = [
        ...this.history.slice(this.historyHead),
        ...this.history.slice(0, this.historyHead),
      ];
    }

    let result = type ? ordered.filter((e) => e.type === type) : ordered;

    if (limit !== undefined && limit > 0) {
      result = result.slice(-limit);
    }

    return result;
  }

  /**
   * Clear all event history.
   */
  clear(): void {
    this.history = [];
    this.historyHead = 0;
    this.historyCount = 0;
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  /**
   * Destroy the event bus, removing all subscriptions and clearing state.
   */
  destroy(): void {
    this._isDestroyed = true;
    this.handlers.clear();
    this.globalHandlers.clear();
    this.history = [];
    this.historyHead = 0;
    this.historyCount = 0;
    this.offlineBuffer.clear();
  }

  /** Whether the bus has been destroyed. */
  get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  // --------------------------------------------------------------------------
  // Offline buffer access
  // --------------------------------------------------------------------------

  /** Get the underlying offline buffer for direct inspection. */
  getOfflineBuffer(): OfflineEventBuffer {
    return this.offlineBuffer;
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private addToHistory(event: DomainEvent): void {
    if (this.historyCount < this.maxHistorySize) {
      this.history.push(event);
      this.historyCount++;
    } else {
      // Ring buffer: overwrite oldest entry in O(1)
      this.history[this.historyHead] = event;
      this.historyHead = (this.historyHead + 1) % this.maxHistorySize;
    }
  }

  private dispatchToHandlers(event: DomainEvent): void {
    // Type-specific handlers
    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        try {
          handler(event);
        } catch (error) {
          this.onHandlerError?.(error, event);
        }
      }
    }

    // Global handlers
    for (const handler of this.globalHandlers) {
      try {
        handler(event);
      } catch (error) {
        this.onHandlerError?.(error, event);
      }
    }
  }
}
