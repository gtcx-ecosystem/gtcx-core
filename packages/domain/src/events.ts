/**
 * Domain Events
 *
 * Re-exported from @gtcx/events for backwards compatibility.
 * The canonical source is now @gtcx/events.
 * New code should import directly from @gtcx/events.
 *
 */

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
} from '@gtcx/events';

export { DomainEventFactory, nullEventEmitter, InMemoryEventEmitter } from '@gtcx/events';
