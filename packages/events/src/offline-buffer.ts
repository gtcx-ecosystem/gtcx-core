/**
 * Offline Event Buffer
 *
 * Stores domain events when the system is offline and replays them
 * through a provided emit function when connectivity is restored.
 *
 * @package @gtcx/events
 */

import type { DomainEvent, BufferedEvent } from './types.js';

// ============================================================================
// OFFLINE BUFFER OPTIONS
// ============================================================================

export interface OfflineBufferOptions {
  /** Maximum number of events to buffer. Defaults to 5000. */
  maxBufferSize?: number;
}

// ============================================================================
// OFFLINE EVENT BUFFER
// ============================================================================

let bufferId = 0;

function generateBufferId(): string {
  bufferId += 1;
  return `buf_${Date.now()}_${bufferId}`;
}

export class OfflineEventBuffer {
  private readonly maxBufferSize: number;
  private buffered: BufferedEvent[] = [];

  constructor(options?: OfflineBufferOptions) {
    this.maxBufferSize = options?.maxBufferSize ?? 5000;
  }

  /**
   * Store an event for later dispatch.
   * If the buffer is full, the oldest event is dropped.
   */
  buffer(event: DomainEvent): void {
    if (this.buffered.length >= this.maxBufferSize) {
      this.buffered.shift();
    }

    this.buffered.push({
      event,
      bufferedAt: Date.now(),
      retryCount: 0,
      id: generateBufferId(),
    });
  }

  /**
   * Replay all buffered events through the provided emit function.
   * Events are flushed in FIFO order. Each event's retryCount is
   * incremented before dispatch. If the emitFn throws, the remaining
   * events stay in the buffer with incremented retry counts.
   */
  async flush(emitFn: (event: DomainEvent) => void): Promise<number> {
    const toFlush = [...this.buffered];
    this.buffered = [];
    let flushedCount = 0;

    for (const entry of toFlush) {
      entry.retryCount += 1;
      try {
        emitFn(entry.event);
        flushedCount += 1;
      } catch {
        // Put remaining events (including current failed one) back
        this.buffered = [entry, ...toFlush.slice(toFlush.indexOf(entry) + 1)];
        break;
      }
    }

    return flushedCount;
  }

  /**
   * Retrieve a copy of all currently buffered events.
   */
  getBuffered(): BufferedEvent[] {
    return [...this.buffered];
  }

  /**
   * Get the number of buffered events.
   */
  get size(): number {
    return this.buffered.length;
  }

  /**
   * Clear all buffered events.
   */
  clear(): void {
    this.buffered = [];
  }
}
