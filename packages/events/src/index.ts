/**
 * @gtcx/events
 *
 * Core event bus for the GTCX architecture.
 * Provides a typed EventEmitter with offline buffering and replay.
 *
 * @packageDocumentation
 */

// Types
export type { EventHandler, EventSubscription, EventBusOptions, BufferedEvent } from './types.js';

// Re-exports from @gtcx/domain
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
} from './types.js';

export { DomainEventFactory, nullEventEmitter } from './types.js';

// Event bus
export { TypedEventBus } from './event-bus.js';

// Offline buffer
export { OfflineEventBuffer } from './offline-buffer.js';
export type { OfflineBufferOptions } from './offline-buffer.js';
