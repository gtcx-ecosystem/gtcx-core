/**
 * Event type definitions for @gtcx/events
 *
 * Re-exports and extends the event types from @gtcx/domain/events.
 *
 * @package @gtcx/events
 */

// Re-export domain event types
export type {
  DomainEventType,
  DomainEvent,
  IDomainEventEmitter,
  RegistrationStartedPayload,
  RegistrationValidatedPayload,
  RegistrationCompletedPayload,
  RegistrationFailedPayload,
  RegistrationProgressPayload,
  PriceCalculatedPayload,
  OpportunityFoundPayload,
  TradeInitiatedPayload,
  TradeExecutedPayload,
  TradeFailedPayload,
  ComplianceCheckStartedPayload,
  ComplianceCheckCompletedPayload,
  ViolationDetectedPayload,
  WarningIssuedPayload,
  ReportGeneratedPayload,
} from '@gtcx/domain';

export { DomainEventFactory, nullEventEmitter } from '@gtcx/domain';

import type { DomainEvent } from '@gtcx/domain';

// ============================================================================
// EXTENDED EVENT TYPES
// ============================================================================

/**
 * Handler function for domain events.
 */
export type EventHandler<T = unknown> = (event: DomainEvent<T>) => void;

/**
 * Subscription handle returned by event bus subscribe methods.
 */
export interface EventSubscription {
  /** Remove this subscription */
  unsubscribe: () => void;
}

/**
 * Configuration options for the TypedEventBus.
 */
export interface EventBusOptions {
  /** Maximum number of events to keep in history. Defaults to 1000. */
  maxHistorySize?: number;
  /** Whether to enable offline buffering. Defaults to true. */
  enableOfflineBuffer?: boolean;
  /** Maximum buffer size for offline events. Defaults to 5000. */
  maxBufferSize?: number;
  /** Called when a handler throws. By default errors are silently swallowed. */
  onHandlerError?: (error: unknown, event: DomainEvent) => void;
}

/**
 * Wrapper around a domain event with buffering metadata.
 */
export interface BufferedEvent<T = unknown> {
  /** The original domain event */
  event: DomainEvent<T>;
  /** Timestamp when the event was buffered */
  bufferedAt: number;
  /** Number of times flush has been attempted for this event */
  retryCount: number;
  /** Unique buffer entry ID */
  id: string;
}
