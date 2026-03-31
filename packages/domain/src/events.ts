/**
 * Domain Events
 *
 * Event definitions for cross-service observability.
 * Implements P12 (Observability) principle.
 *
 */

// ============================================================================
// EVENT TYPES
// ============================================================================

export type DomainEventType =
  // Registration events
  | 'registration.started'
  | 'registration.validated'
  | 'registration.completed'
  | 'registration.failed'
  | 'registration.progress_updated'

  // Trading events
  | 'trading.price_calculated'
  | 'trading.opportunity_found'
  | 'trading.trade_initiated'
  | 'trading.trade_executed'
  | 'trading.trade_failed'
  | 'trading.settlement_started'
  | 'trading.settlement_completed'

  // Compliance events
  | 'compliance.check_started'
  | 'compliance.check_completed'
  | 'compliance.violation_detected'
  | 'compliance.warning_issued'
  | 'compliance.report_generated'
  | 'compliance.framework_registered'
  | 'compliance.zk_proof_invalid'
  | 'compliance.zk_proof_verified';

// ============================================================================
// BASE EVENT
// ============================================================================

export interface DomainEvent<T = unknown> {
  /** Event type */
  type: DomainEventType;
  /** Event payload */
  payload: T;
  /** Unix timestamp (ms) */
  timestamp: number;
  /** Correlation ID for distributed tracing */
  correlationId?: string;
  /** Source service */
  source: 'registration' | 'trading' | 'compliance';
  /** Schema version for evolution */
  version: number;
}

// ============================================================================
// REGISTRATION EVENT PAYLOADS
// ============================================================================

export interface RegistrationStartedPayload {
  sessionId: string;
  commodityType: string;
  producerId: string;
  deviceId?: string;
}

export interface RegistrationValidatedPayload {
  sessionId: string;
  validationResult: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
}

export interface RegistrationCompletedPayload {
  sessionId: string;
  assetLotId: string;
  commodityType: string;
  producerId: string;
  certificateId: string;
  weight: number;
  weightUnit: string;
  proofHash: string;
}

export interface RegistrationFailedPayload {
  sessionId: string;
  commodityType: string;
  producerId: string;
  error: string;
  errorCode?: string;
  validationErrors?: string[];
}

export interface RegistrationProgressPayload {
  sessionId: string;
  step: string;
  progress: number;
  completedSteps: string[];
}

// ============================================================================
// TRADING EVENT PAYLOADS
// ============================================================================

export interface PriceCalculatedPayload {
  assetLotId: string;
  commodityType: string;
  basePrice: number;
  adjustedPrice: number;
  currency: string;
  adjustments: {
    form: number;
    purity: number;
    quality: number;
    location: number;
  };
}

export interface OpportunityFoundPayload {
  opportunityId: string;
  assetLotId: string;
  commodityType: string;
  askingPrice: number;
  fairPrice: number;
  currency: string;
}

export interface TradeInitiatedPayload {
  transactionId: string;
  assetLotId: string;
  sellerId: string;
  buyerId: string;
  quantity: number;
  agreedPrice: number;
  currency: string;
}

export interface TradeExecutedPayload {
  transactionId: string;
  assetLotId: string;
  sellerId: string;
  buyerId: string;
  quantity: number;
  quantityUnit: string;
  finalPrice: number;
  currency: string;
  paymentMethod: string;
  proofHash: string;
}

export interface TradeFailedPayload {
  transactionId?: string;
  assetLotId: string;
  sellerId?: string;
  buyerId: string;
  error: string;
  errorCode: 'validation' | 'compliance' | 'insufficient_funds' | 'system_error';
}

// ============================================================================
// COMPLIANCE EVENT PAYLOADS
// ============================================================================

export interface ComplianceCheckStartedPayload {
  checkId: string;
  entityId: string;
  entityType: 'asset_lot' | 'transaction' | 'trader' | 'producer';
  jurisdiction: string;
}

export interface ComplianceCheckCompletedPayload {
  checkId: string;
  entityId: string;
  entityType: string;
  recordCount: number;
  violations: number;
  warnings: number;
  compliant: boolean;
  duration: number; // ms
}

export interface ViolationDetectedPayload {
  recordId: string;
  checkId: string;
  entityId: string;
  entityType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  regulationCode: string;
  description: string;
}

export interface WarningIssuedPayload {
  recordId: string;
  checkId: string;
  entityId: string;
  entityType: string;
  severity: 'medium' | 'low';
  regulationCode: string;
  description: string;
}

export interface ReportGeneratedPayload {
  reportId: string;
  format: 'summary' | 'detailed' | 'export';
  recordCount: number;
  complianceScore: number;
  criticalIssues: number;
  duration: number; // ms
}

// ============================================================================
// EVENT EMITTER INTERFACE
// ============================================================================

export interface IDomainEventEmitter {
  /**
   * Emit a domain event
   */
  emit(event: DomainEvent): void;

  /**
   * Subscribe to events by type
   */
  on(type: DomainEventType, handler: (event: DomainEvent) => void): () => void;

  /**
   * Subscribe to all events
   */
  onAny(handler: (event: DomainEvent) => void): () => void;
}

// ============================================================================
// EVENT FACTORY
// ============================================================================

export class DomainEventFactory {
  private correlationId?: string;

  constructor(correlationId?: string) {
    this.correlationId = correlationId;
  }

  getCorrelationId(): string | undefined {
    return this.correlationId;
  }

  /**
   * Create a registration event
   */
  registration<T>(
    type: Extract<DomainEventType, `registration.${string}`>,
    payload: T,
    correlationId?: string
  ): DomainEvent<T> {
    return {
      type,
      payload,
      timestamp: Date.now(),
      correlationId: correlationId ?? this.correlationId,
      source: 'registration',
      version: 1,
    };
  }

  /**
   * Create a trading event
   */
  trading<T>(
    type: Extract<DomainEventType, `trading.${string}`>,
    payload: T,
    correlationId?: string
  ): DomainEvent<T> {
    return {
      type,
      payload,
      timestamp: Date.now(),
      correlationId: correlationId ?? this.correlationId,
      source: 'trading',
      version: 1,
    };
  }

  /**
   * Create a compliance event
   */
  compliance<T>(
    type: Extract<DomainEventType, `compliance.${string}`>,
    payload: T,
    correlationId?: string
  ): DomainEvent<T> {
    return {
      type,
      payload,
      timestamp: Date.now(),
      correlationId: correlationId ?? this.correlationId,
      source: 'compliance',
      version: 1,
    };
  }
}

// ============================================================================
// NULL EMITTER (for testing or when events not needed)
// ============================================================================

export const nullEventEmitter: IDomainEventEmitter = {
  emit: () => {},
  on: () => () => {},
  onAny: () => () => {},
};

// ============================================================================
// IN-MEMORY EMITTER (for testing)
// ============================================================================

export class InMemoryEventEmitter implements IDomainEventEmitter {
  private handlers: Map<DomainEventType, Set<(event: DomainEvent) => void>> = new Map();
  private globalHandlers: Set<(event: DomainEvent) => void> = new Set();
  private events: DomainEvent[] = [];

  emit(event: DomainEvent): void {
    this.events.push(event);

    // Notify type-specific handlers
    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      typeHandlers.forEach((handler) => handler(event));
    }

    // Notify global handlers
    this.globalHandlers.forEach((handler) => handler(event));
  }

  on(type: DomainEventType, handler: (event: DomainEvent) => void): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  onAny(handler: (event: DomainEvent) => void): () => void {
    this.globalHandlers.add(handler);
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  /**
   * Get all emitted events (for testing)
   */
  getEvents(): DomainEvent[] {
    return [...this.events];
  }

  /**
   * Get events by type (for testing)
   */
  getEventsByType(type: DomainEventType): DomainEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  /**
   * Clear all events (for testing)
   */
  clear(): void {
    this.events = [];
  }
}
