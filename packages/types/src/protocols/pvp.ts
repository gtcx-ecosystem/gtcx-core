// ============================================================================
// PVP PROTOCOL TYPES
// Payment vs Payment Settlement
// ============================================================================

/**
 * Trade order
 */
export interface TradeOrder {
  id: string;
  type: 'buy' | 'sell';
  lotId: string;
  traderId: string;
  price: PriceQuote;
  quantity: QuantitySpec;
  terms: TradeTerms;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
}

export interface PriceQuote {
  amount: number;
  currency: string;
  pricePerUnit: number;
  unit: 'g' | 'kg' | 'oz' | 'troy_oz';
  validUntil: number;
  source?: 'spot' | 'negotiated' | 'auction';
}

export interface QuantitySpec {
  amount: number;
  unit: 'g' | 'kg' | 'oz' | 'troy_oz';
  tolerance?: number; // percentage
}

export interface TradeTerms {
  settlementType: SettlementType;
  settlementWindow: number; // hours
  deliveryMethod: DeliveryMethod;
  deliveryLocation?: string;
  insuranceRequired: boolean;
  escrowRequired: boolean;
  arbitrationClause?: string;
}

export type SettlementType = 
  | 'immediate'
  | 't_plus_1'
  | 't_plus_2'
  | 'on_delivery'
  | 'escrow';

export type DeliveryMethod =
  | 'physical'
  | 'vault_transfer'
  | 'title_transfer'
  | 'certificate_only';

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'matched'
  | 'settling'
  | 'settled'
  | 'cancelled'
  | 'expired'
  | 'disputed';

/**
 * Trade match - when buyer and seller agree
 */
export interface TradeMatch {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  matchedAt: number;
  matchPrice: PriceQuote;
  matchQuantity: QuantitySpec;
  settlement: SettlementRecord;
}

/**
 * Settlement record - the actual exchange
 */
export interface SettlementRecord {
  id: string;
  tradeMatchId: string;
  status: SettlementStatus;
  paymentLeg: PaymentLeg;
  assetLeg: AssetLeg;
  timeline: SettlementTimeline;
  verification: SettlementVerification;
}

export type SettlementStatus =
  | 'initiated'
  | 'payment_pending'
  | 'payment_received'
  | 'asset_pending'
  | 'asset_transferred'
  | 'completed'
  | 'failed'
  | 'rolled_back';

export interface PaymentLeg {
  from: string;
  to: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference?: string;
  confirmedAt?: number;
  proof?: string;
}

export type PaymentMethod =
  | 'bank_transfer'
  | 'mobile_money'
  | 'escrow'
  | 'letter_of_credit'
  | 'crypto';

export interface AssetLeg {
  from: string;
  to: string;
  lotId: string;
  custodyTransferId?: string;
  deliveryMethod: DeliveryMethod;
  confirmedAt?: number;
  proof?: string;
}

export interface SettlementTimeline {
  initiatedAt: number;
  paymentDeadline: number;
  assetDeadline: number;
  completedAt?: number;
  failedAt?: number;
}

export interface SettlementVerification {
  paymentVerified: boolean;
  paymentVerifiedBy?: string;
  paymentVerifiedAt?: number;
  assetVerified: boolean;
  assetVerifiedBy?: string;
  assetVerifiedAt?: number;
  finalSignoff?: string;
}

/**
 * Escrow account for holding funds/assets
 */
export interface EscrowAccount {
  id: string;
  tradeMatchId: string;
  type: 'payment' | 'asset' | 'both';
  status: EscrowStatus;
  lockedAt: number;
  releaseConditions: ReleaseCondition[];
  releasedAt?: number;
  releasedTo?: string;
}

export type EscrowStatus =
  | 'created'
  | 'funded'
  | 'locked'
  | 'releasing'
  | 'released'
  | 'disputed'
  | 'refunded';

export interface ReleaseCondition {
  type: string;
  description: string;
  satisfied: boolean;
  satisfiedAt?: number;
  evidence?: string;
}

/**
 * Atomic swap for simultaneous exchange
 */
export interface AtomicSwap {
  id: string;
  settlementId: string;
  hashLock: string;
  timeLock: number;
  paymentPreimage?: string;
  assetPreimage?: string;
  status: SwapStatus;
  createdAt: number;
  executedAt?: number;
}

export type SwapStatus =
  | 'pending'
  | 'locked'
  | 'executed'
  | 'expired'
  | 'refunded';
