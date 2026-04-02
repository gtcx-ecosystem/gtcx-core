/**
 * @gtcx/events
 *
 * Core event bus for the GTCX architecture.
 * Canonical source for domain event types, payloads, and infrastructure.
 * Provides a typed EventEmitter with offline buffering and replay.
 *
 * @packageDocumentation
 */

// Domain event types, payloads, and infrastructure
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
  EventHandler,
  EventSubscription,
  EventBusOptions,
  BufferedEvent,
} from './types.js';

export { DomainEventFactory, nullEventEmitter, InMemoryEventEmitter } from './types.js';

// Event bus
export { TypedEventBus } from './event-bus.js';

// Offline buffer
export { OfflineEventBuffer } from './offline-buffer.js';
export type { OfflineBufferOptions } from './offline-buffer.js';
