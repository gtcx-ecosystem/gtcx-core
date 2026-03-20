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
  | 'permit.revoked'

  // Protocol Events (cross-protocol domain events)
  | 'tradepass.issued'
  | 'tradepass.revoked'
  | 'tradepass.expired'
  | 'geotag.recorded'
  | 'geotag.verified'
  | 'geotag.disputed'
  | 'gci.scored'
  | 'gci.updated'
  | 'gci.expired';

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

// ---------------------------------------------------------------------------
// Protocol event data schemas
// NATS subject: gtcx.events.{aggregate}.{action}
// ---------------------------------------------------------------------------

/** TradePass credential issued to a subject. */
export interface TradePassIssuedData {
  credentialId: string;
  credentialType: string;
  subjectDid: string;
  issuerDid: string;
  predicateUri: string;
  jurisdiction: string;
  issuedAt: number;
  expiresAt?: number;
}

/** TradePass credential revoked. */
export interface TradePassRevokedData {
  credentialId: string;
  subjectDid: string;
  revokedBy: string;
  reason: string;
  revokedAt: number;
  accumulatorEpoch?: number;
}

/** GeoTag location claim recorded for a commodity lot. */
export interface GeoTagRecordedData {
  claimId: string;
  lotId: string;
  operatorDid: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  source: 'gps' | 'cell' | 'wifi' | 'nfc' | 'manual';
  commodityType: string;
  jurisdiction: string;
  chainHash: string;
  recordedAt: number;
}

/** GeoTag location claim verified by cross-reference. */
export interface GeoTagVerifiedData {
  claimId: string;
  lotId: string;
  verifiedBy: string;
  method: string;
  confidence: number;
  verifiedAt: number;
}

/** GCI Score computed for a subject. */
export interface GciScoredData {
  scoreId: string;
  subjectDid: string;
  compositeScore: number;
  tier: string;
  components: {
    tradeHistory: number;
    complianceRecord: number;
    verificationDepth: number;
    communityTrust: number;
  };
  jurisdiction: string;
  commodityType: string;
  validUntil: number;
  scoredAt: number;
}

/** GCI Score updated (recalculation due to new data). */
export interface GciUpdatedData {
  scoreId: string;
  subjectDid: string;
  previousScore: number;
  newScore: number;
  previousTier: string;
  newTier: string;
  trigger: string;
  updatedAt: number;
}

/** Map from protocol event types to their data shapes. */
export interface ProtocolEventDataMap {
  'tradepass.issued': TradePassIssuedData;
  'tradepass.revoked': TradePassRevokedData;
  'tradepass.expired': TradePassRevokedData;
  'geotag.recorded': GeoTagRecordedData;
  'geotag.verified': GeoTagVerifiedData;
  'geotag.disputed': GeoTagVerifiedData;
  'gci.scored': GciScoredData;
  'gci.updated': GciUpdatedData;
  'gci.expired': GciScoredData;
}

/** Type-safe protocol event constructor. */
export type ProtocolEvent<K extends keyof ProtocolEventDataMap> = DomainEvent<
  ProtocolEventDataMap[K]
> & { type: K };

/** NATS subject mapping for protocol events. */
export const PROTOCOL_EVENT_SUBJECTS: Record<keyof ProtocolEventDataMap, string> = {
  'tradepass.issued': 'gtcx.events.TradePass.issued',
  'tradepass.revoked': 'gtcx.events.TradePass.revoked',
  'tradepass.expired': 'gtcx.events.TradePass.expired',
  'geotag.recorded': 'gtcx.events.GeoTag.recorded',
  'geotag.verified': 'gtcx.events.GeoTag.verified',
  'geotag.disputed': 'gtcx.events.GeoTag.disputed',
  'gci.scored': 'gtcx.events.GCI.scored',
  'gci.updated': 'gtcx.events.GCI.updated',
  'gci.expired': 'gtcx.events.GCI.expired',
};

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
