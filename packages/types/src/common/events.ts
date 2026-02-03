// ============================================================================
// EVENT TYPES
// Domain events for event-driven architecture
// ============================================================================

export type EventType =
  // Identity Events
  | 'identity.created'
  | 'identity.updated'
  | 'identity.verified'
  | 'identity.suspended'
  | 'role.granted'
  | 'role.revoked'
  
  // Location Events
  | 'location.captured'
  | 'location.verified'
  | 'photo.captured'
  | 'session.started'
  | 'session.completed'
  
  // Compliance Events
  | 'compliance.evaluated'
  | 'compliance.passed'
  | 'compliance.failed'
  | 'attestation.issued'
  
  // Custody Events
  | 'custody.received'
  | 'custody.transferred'
  | 'custody.sealed'
  | 'custody.verified'
  | 'lot.registered'
  | 'lot.certified'
  
  // Trading Events
  | 'listing.created'
  | 'listing.updated'
  | 'listing.cancelled'
  | 'order.placed'
  | 'order.matched'
  | 'order.cancelled'
  | 'trade.executed'
  | 'settlement.initiated'
  | 'settlement.completed'
  | 'settlement.failed'
  
  // Permit Events
  | 'permit.submitted'
  | 'permit.approved'
  | 'permit.rejected'
  | 'permit.issued'
  | 'permit.expired'
  | 'permit.revoked';

export interface DomainEvent<T = unknown> {
  id: string;
  type: EventType;
  timestamp: number;
  version: string;
  source: string;
  correlationId?: string;
  causationId?: string;
  actor?: {
    id: string;
    type: string;
  };
  subject?: {
    id: string;
    type: string;
  };
  data: T;
  metadata?: Record<string, unknown>;
}

export interface EventEnvelope {
  event: DomainEvent;
  partition?: string;
  key?: string;
  headers?: Record<string, string>;
}

export interface EventHandler<T = unknown> {
  eventType: EventType | EventType[];
  handle(event: DomainEvent<T>): Promise<void>;
}

export interface EventSubscription {
  id: string;
  eventTypes: EventType[];
  handler: string;
  filter?: Record<string, unknown>;
  active: boolean;
}
