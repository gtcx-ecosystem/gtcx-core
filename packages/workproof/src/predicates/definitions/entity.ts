import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

/**
 * Entity is legally registered in a jurisdiction.
 *
 * Required for all `entity` and `physical_asset` operators in the GTCX
 * verification fabric (mining companies, trading firms, banks, refineries,
 * vessels, warehouses, etc.).
 *
 * Evidence: corporate registry record from the issuing jurisdiction's
 * authoritative source. Examples: Companies House (UK), DPNT (DRC),
 * RGDC (Ghana), CAC (Nigeria).
 */
export const EntityRegistered: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.EntityRegistered,
  name: 'Entity Registered',
  description: 'Subject entity is legally registered with a recognized jurisdictional authority',
  domain: 'identity',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['corporate_registry'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { corporate_registry: 1.0 },
    minimumThreshold: 0.85,
  },
  temporal: { validDuration: 'P1Y', renewalRequired: true, monitoringType: 'periodic' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['corporate registration', 'legal entity'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.LicenseValid,
      WORKPROOF_PREDICATE_URIS.BeneficialOwnershipDisclosed,
    ],
    contextTemplate: 'Entity registered in {{jurisdiction}}',
  },
};

/**
 * Entity has cleared sanctions screening against one or more authoritative lists.
 *
 * For tier-1 institutional buyers, used in a THRESHOLD composite (e.g., 2 of 3
 * sources from Refinitiv World-Check, Dow Jones Risk & Compliance, ComplyAdvantage).
 * Single-source clearance is acceptable for lower verification tiers.
 *
 * The `value` field carries the source identifier (e.g., "ofac_sdn", "refinitiv",
 * "un_consolidated", "complyadvantage").
 */
export const SanctionsCleared: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.SanctionsCleared,
  name: 'Sanctions Cleared',
  description: 'Subject has cleared sanctions screening against an authoritative list',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'string' },
  evidence: { required: ['sanctions_screening'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.98,
    evidenceWeights: { sanctions_screening: 1.0 },
    minimumThreshold: 0.9,
    decayModel: 'exponential',
    halfLife: 90, // Sanctions data goes stale; refresh quarterly
  },
  temporal: {
    validDuration: 'P3M',
    renewalRequired: true,
    monitoringType: 'continuous',
    triggers: ['sanctions.list.updated', 'subject.identifier.changed'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['sanctions list match', 'OFAC SDN', 'UN consolidated', 'World-Check'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.PepCleared,
      WORKPROOF_PREDICATE_URIS.AdverseMediaCleared,
    ],
    contextTemplate: 'Sanctions cleared via {{value}} on {{effectiveAt}}',
  },
};

/**
 * Entity has cleared Politically Exposed Person (PEP) screening.
 *
 * PEP screening identifies individuals (and their close associates) who hold
 * or have held prominent public positions, where there is heightened risk of
 * corruption or money laundering.
 */
export const PepCleared: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.PepCleared,
  name: 'PEP Cleared',
  description: 'Subject has cleared politically-exposed-person screening',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'string' },
  evidence: { required: ['sanctions_screening'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { sanctions_screening: 1.0 },
    minimumThreshold: 0.85,
    decayModel: 'exponential',
    halfLife: 90,
  },
  temporal: {
    validDuration: 'P3M',
    renewalRequired: true,
    monitoringType: 'periodic',
    triggers: ['pep.list.updated'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['politically exposed', 'public official', 'close associate'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.SanctionsCleared,
      WORKPROOF_PREDICATE_URIS.AdverseMediaCleared,
    ],
    contextTemplate: 'PEP cleared via {{value}}',
  },
};

/**
 * Entity has cleared adverse media screening.
 *
 * Adverse media (also "negative news") screening surfaces public reporting
 * of involvement in financial crime, regulatory violations, fraud, or other
 * conduct that materially affects counterparty risk.
 */
export const AdverseMediaCleared: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.AdverseMediaCleared,
  name: 'Adverse Media Cleared',
  description: 'Subject has cleared adverse media (negative news) screening',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'string' },
  evidence: { required: ['sanctions_screening'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.85,
    evidenceWeights: { sanctions_screening: 1.0 },
    minimumThreshold: 0.7,
    decayModel: 'exponential',
    halfLife: 60, // Media moves faster than sanctions lists
  },
  temporal: {
    validDuration: 'P2M',
    renewalRequired: true,
    monitoringType: 'continuous',
    triggers: ['adverse_media.alert', 'subject.identifier.changed'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['negative news', 'public allegations', 'media reporting'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.SanctionsCleared,
      WORKPROOF_PREDICATE_URIS.PepCleared,
    ],
    contextTemplate: 'Adverse media cleared via {{value}}',
  },
};

/**
 * Entity's beneficial owners (UBOs) are disclosed and verified against
 * an authoritative source.
 *
 * Required for full-tier verification of any entity engaged in cross-border
 * trade. Implements the FATF beneficial-ownership transparency requirement.
 */
export const BeneficialOwnershipDisclosed: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.BeneficialOwnershipDisclosed,
  name: 'Beneficial Ownership Disclosed',
  description: 'Ultimate beneficial owners are documented and verified',
  domain: 'identity',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['corporate_registry'], optional: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.9,
    evidenceWeights: { corporate_registry: 0.7, document_hash: 0.3 },
    minimumThreshold: 0.75,
  },
  temporal: {
    validDuration: 'P1Y',
    renewalRequired: true,
    monitoringType: 'event_triggered',
    triggers: ['ownership.changed', 'control.transferred'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['UBO', 'beneficial ownership', 'control structure', 'shell company'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.EntityRegistered],
    contextTemplate: 'Beneficial ownership disclosed; {{value}} UBOs documented',
  },
};

/**
 * Entity holds a current accreditation from a recognized standards body.
 *
 * Used for inspection firms, certifiers, and labs to attest authority to
 * issue domain-specific certifications. Examples: ISO 17020 (inspection),
 * ISO 17025 (testing labs), RJC accreditation (jewellery supply chain).
 *
 * The `value` field carries the accreditation reference.
 */
export const AccreditationHeld: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.AccreditationHeld,
  name: 'Accreditation Held',
  description: 'Subject holds a recognized accreditation issued by a standards body',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'string' },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { document_hash: 1.0 },
    minimumThreshold: 0.85,
  },
  temporal: {
    validDuration: 'P3Y',
    renewalRequired: true,
    monitoringType: 'event_triggered',
    triggers: ['accreditation.suspended', 'accreditation.revoked'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['accreditation certificate', 'ISO 17020', 'standards body'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.LicenseValid,
      WORKPROOF_PREDICATE_URIS.StandardMet,
    ],
    contextTemplate: 'Accreditation {{value}} held',
  },
};

/**
 * Collective subject is recognized by a relevant authority.
 *
 * Used for collectives (cooperatives, community councils, indigenous
 * communities, unions) where formal "registration" doesn't apply but
 * recognition by a jurisdictional authority or peer body is documented.
 *
 * Distinct from `EntityRegistered` (which requires formal corporate
 * registration) — recognition can be customary, traditional, or by
 * peer attestation.
 */
export const EntityRecognized: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.EntityRecognized,
  name: 'Entity Recognized',
  description: 'Collective subject is recognized by a relevant jurisdictional or peer authority',
  domain: 'identity',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: {
    required: ['witness_attestation'],
    optional: ['corporate_registry', 'document_hash'],
  },
  attestation: {
    allowedAttestors: [
      { type: 'credential', value: 'AuthorityID' },
      { type: 'credential', value: 'ProducerID' },
    ],
    selfAttestation: false,
    minimumAttestors: 2,
  },
  confidence: {
    baseScore: 0.75,
    evidenceWeights: {
      witness_attestation: 0.6,
      corporate_registry: 0.3,
      document_hash: 0.1,
    },
    minimumThreshold: 0.6,
  },
  temporal: { validDuration: 'P2Y', renewalRequired: true, monitoringType: 'periodic' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['traditional authority', 'community council', 'cooperative recognition'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.EntityRegistered,
      WORKPROOF_PREDICATE_URIS.CommunityMembership,
    ],
    contextTemplate: 'Recognized as {{value}}',
  },
};

/**
 * Digital artifact (credential, license, certificate, document) was issued
 * by a specific entity.
 *
 * Used for assertion that a digital artifact has provenance traceable to a
 * known issuer DID. Required for all `digital_artifact` operators.
 *
 * The `value` field carries the issuer DID.
 */
export const IssuedBy: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.IssuedBy,
  name: 'Issued By',
  description: 'Digital artifact has documented issuer with verifiable signature',
  domain: 'relationship',
  version: '1.0.0',
  schema: { type: 'string', pattern: '^did:gtcx:tp_[a-z]{3}_[a-f0-9]{16}$' },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'pattern', value: 'did:gtcx:tp_*' }],
    selfAttestation: true, // The issuer signs itself when issuing the artifact
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { document_hash: 1.0 },
    minimumThreshold: 0.9,
  },
  temporal: { validDuration: 'P10Y', renewalRequired: false }, // Issuance is immutable
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['issuer DID', 'cryptographic signature', 'provenance'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.EntityRegistered],
    contextTemplate: 'Issued by {{value}}',
  },
};

/**
 * Physical asset's ownership chain is documented.
 *
 * Used for `physical_asset` operators (mine sites, vessels, warehouses)
 * where chain-of-title needs to be verifiable across transfers. Each entry
 * in the chain represents one ownership event with cryptographic linkage
 * to the previous entry.
 *
 * The `value` field carries the count of documented ownership events.
 */
export const OwnershipChain: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.OwnershipChain,
  name: 'Ownership Chain',
  description: 'Physical asset has a documented chain of ownership',
  domain: 'relationship',
  version: '1.0.0',
  schema: { type: 'number', min: 1 },
  evidence: { required: ['document_hash', 'corporate_registry'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.9,
    evidenceWeights: { document_hash: 0.6, corporate_registry: 0.4 },
    minimumThreshold: 0.75,
  },
  temporal: {
    validDuration: 'P5Y',
    renewalRequired: false,
    monitoringType: 'event_triggered',
    triggers: ['ownership.transferred'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['chain of custody', 'title transfer', 'asset provenance'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.EntityRegistered,
      WORKPROOF_PREDICATE_URIS.OriginAuthenticated,
    ],
    contextTemplate: '{{value}} ownership events documented',
  },
};
