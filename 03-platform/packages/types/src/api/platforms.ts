// ============================================================================
// PLATFORM API TYPES
// CRX, SGX, AGX service interfaces
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// CRX - Compliance Regulatory Exchange
// ─────────────────────────────────────────────────────────────────────────────

export interface CrxPermitCreateRequest {
  type: string;
  applicantId: string;
  scope: {
    commodity: string[];
    regions: string[];
    activities: string[];
  };
  documents?: string[];
  metadata?: Record<string, unknown>;
}

export interface CrxPermitResponse {
  permitId: string;
  permitNumber: string;
  status: string;
  currentStep: string;
  nextActions: PermitAction[];
  estimatedCompletion?: number;
}

export interface PermitAction {
  action: string;
  description: string;
  requiredBy?: string;
  deadline?: number;
  instructions?: string;
}

export interface CrxComplianceCheckRequest {
  subjectId: string;
  subjectType: 'tradepass' | 'lot' | 'site';
  checkType?: string;
  policyIds?: string[];
}

export interface CrxComplianceCheckResponse {
  checkId: string;
  subjectId: string;
  score: number;
  tier: string;
  passed: boolean;
  results: Array<{
    policyId: string;
    policyName: string;
    score: number;
    issues: string[];
  }>;
  attestationId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SGX - Sovereign Gold Exchange
// ─────────────────────────────────────────────────────────────────────────────

export interface SgxListingCreateRequest {
  lotId: string;
  sellerId: string;
  price: {
    amount: number;
    currency: string;
    pricePerUnit: number;
    unit: string;
  };
  terms: {
    minimumQuantity?: number;
    settlementType: string;
    deliveryMethod: string;
    validUntil: number;
  };
  visibility?: 'public' | 'private' | 'invited';
}

export interface SgxListingResponse {
  listingId: string;
  lotId: string;
  status: string;
  price: {
    amount: number;
    currency: string;
    pricePerUnit: number;
    unit: string;
  };
  available: {
    quantity: number;
    unit: string;
  };
  views: number;
  inquiries: number;
  createdAt: number;
}

export interface SgxOrderRequest {
  listingId: string;
  buyerId: string;
  quantity: {
    amount: number;
    unit: string;
  };
  paymentMethod: string;
  deliveryPreference?: string;
}

export interface SgxOrderResponse {
  orderId: string;
  listingId: string;
  status: string;
  totalAmount: number;
  currency: string;
  settlement: {
    status: string;
    paymentDeadline: number;
    deliveryDeadline: number;
  };
  instructions: string[];
}

export interface SgxTradeResponse {
  tradeId: string;
  buyOrderId: string;
  sellOrderId: string;
  lotId: string;
  quantity: number;
  unit: string;
  price: number;
  currency: string;
  total: number;
  status: string;
  settledAt?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// AGX - Africa Gold Exchange (Global)
// ─────────────────────────────────────────────────────────────────────────────

export interface AgxDiscoveryRequest {
  commodity: string;
  quantity?: {
    min?: number;
    max?: number;
    unit: string;
  };
  price?: {
    min?: number;
    max?: number;
    currency: string;
  };
  origins?: string[];
  complianceTier?: string[];
  certifications?: string[];
}

export interface AgxDiscoveryResponse {
  listings: AgxListing[];
  totalCount: number;
  aggregations: {
    byOrigin: Record<string, number>;
    byTier: Record<string, number>;
    priceRange: { min: number; max: number };
    quantityRange: { min: number; max: number };
  };
}

export interface AgxListing {
  listingId: string;
  sgxId: string;
  lotSummary: {
    commodity: string;
    weight: number;
    unit: string;
    origin: string;
    complianceTier: string;
  };
  price: {
    amount: number;
    currency: string;
    pricePerUnit: number;
  };
  seller: {
    id: string;
    rating?: number;
    verifiedSince?: number;
  };
  availability: string;
}

export interface AgxRouteRequest {
  buyerLocation: string;
  sellerLocation: string;
  commodity: string;
  quantity: number;
  urgency?: 'standard' | 'express' | 'urgent';
}

export interface AgxRouteResponse {
  routes: TradeRoute[];
  recommendedRoute: string;
  estimatedCosts: RouteCosts;
}

export interface TradeRoute {
  id: string;
  path: string[];
  duration: number;
  cost: number;
  compliance: string[];
  risks: string[];
}

export interface RouteCosts {
  transport: number;
  insurance: number;
  duties: number;
  fees: number;
  total: number;
  currency: string;
}
