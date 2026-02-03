// ============================================================================
// TRADEPASS PROTOCOL TYPES
// Identity & Authorization
// ============================================================================

/**
 * Decentralized Identifier for GTCX participants
 */
export interface TradePassDID {
  id: string; // did:gtcx:{publicKeyHash}
  publicKey: string;
  controller: string;
  created: number;
  updated: number;
}

/**
 * Verifiable Credential structure
 */
export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id: string;
    [key: string]: unknown;
  };
  proof: CredentialProof;
}

export interface CredentialProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}

/**
 * TradePass Identity - the core identity container
 */
export interface TradePassIdentity {
  did: TradePassDID;
  credentials: VerifiableCredential[];
  roles: TradePassRole[];
  status: 'active' | 'suspended' | 'revoked';
  createdAt: number;
  updatedAt: number;
}

/**
 * Role-based entitlements (time-boxed)
 */
export interface TradePassRole {
  id: string;
  type: TradePassRoleType;
  issuedBy: string;
  issuedAt: number;
  expiresAt: number;
  permissions: string[];
  constraints?: RoleConstraints;
}

export type TradePassRoleType =
  | 'miner'
  | 'collector'
  | 'transporter'
  | 'refiner'
  | 'trader'
  | 'regulator'
  | 'auditor'
  | 'operator';

export interface RoleConstraints {
  maxTransactionValue?: number;
  allowedRegions?: string[];
  allowedCommodities?: string[];
  requiresApproval?: boolean;
}

/**
 * Role delegation record
 */
export interface RoleDelegation {
  id: string;
  fromDid: string;
  toDid: string;
  role: TradePassRole;
  delegatedAt: number;
  revokedAt?: number;
  reason?: string;
}
