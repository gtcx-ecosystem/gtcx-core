[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/types

# @gtcx/types

Core type definitions for the GTCX ecosystem.

## Installation

```bash
pnpm add @gtcx/types
```

## Quick Start

```typescript
import type { Identity, TradePass, GeoTag, User, Lot } from '@gtcx/types';
```

## API

| Export      | Description                  |
| ----------- | ---------------------------- |
| `Identity`  | Core identity protocol type  |
| `TradePass` | Trade pass protocol type     |
| `GeoTag`    | Geo-location tagging type    |
| `GCI`       | Global Compliance Identifier |
| `PvP`       | Proof-vs-Provenance protocol |
| `VaultMark` | Vault marking protocol       |
| `User`      | User model type              |
| `Lot`       | Lot model type               |
| `Permit`    | Permit model type            |
| `Site`      | Site model type              |

> **Note:** Types-only package — no runtime dependencies.

## When to use `@gtcx/types` vs `@gtcx/domain`

These packages serve different layers of the stack:

- **`@gtcx/types`** — Protocol-level types. Use when building protocol implementations (3-protocols) or platform integrations that work directly with the six verification protocols. Defines: `TradePass`, `GeoTag`, `GCI`, `VaultMark`, `PvP`, `Identity`, `Lot`, `User`, `Permit`, `Site`.

- **`@gtcx/domain`** — Business-domain types and runtime services. Use when building application services (6-platforms, 7-mobile) that handle asset registration, trading, and compliance workflows. Defines: `AssetLot`, `Transaction`, `Trader`, `ComplianceRecord`, plus events, schemas, metrics, and offline infrastructure.

`@gtcx/types` has zero runtime code and zero internal dependencies. `@gtcx/domain` depends on `@gtcx/utils` and peers on `@gtcx/types` and `@gtcx/crypto`.

If you need both, import protocol types from `@gtcx/types` and business logic types from `@gtcx/domain`.

## Related

- [Architecture Decision Records](../../_media/README.md)

## License

MIT

## Classes

- [GtcxException](classes/GtcxException.md)

## Interfaces

- [AgenticProvenance](interfaces/AgenticProvenance.md)
- [AgxDiscoveryRequest](interfaces/AgxDiscoveryRequest.md)
- [AgxDiscoveryResponse](interfaces/AgxDiscoveryResponse.md)
- [AgxListing](interfaces/AgxListing.md)
- [AgxRouteRequest](interfaces/AgxRouteRequest.md)
- [AgxRouteResponse](interfaces/AgxRouteResponse.md)
- [AnisaContextRequest](interfaces/AnisaContextRequest.md)
- [AnisaContextResponse](interfaces/AnisaContextResponse.md)
- [AnisaInsightRequest](interfaces/AnisaInsightRequest.md)
- [AnisaInsightResponse](interfaces/AnisaInsightResponse.md)
- [ApiError](interfaces/ApiError.md)
- [ApiResponse](interfaces/ApiResponse.md)
- [AssetLeg](interfaces/AssetLeg.md)
- [AtomicSwap](interfaces/AtomicSwap.md)
- [BoundingBox](interfaces/BoundingBox.md)
- [ComplianceAttestation](interfaces/ComplianceAttestation.md)
- [ComplianceEvaluation](interfaces/ComplianceEvaluation.md)
- [ComplianceFlag](interfaces/ComplianceFlag.md)
- [CompliancePolicy](interfaces/CompliancePolicy.md)
- [ComplianceRule](interfaces/ComplianceRule.md)
- [ComplianceScore](interfaces/ComplianceScore.md)
- [ConsensusResult](interfaces/ConsensusResult.md)
- [CortexAnalyticsQuery](interfaces/CortexAnalyticsQuery.md)
- [CortexAnalyticsResponse](interfaces/CortexAnalyticsResponse.md)
- [CortexAnomalyAlert](interfaces/CortexAnomalyAlert.md)
- [CortexEvent](interfaces/CortexEvent.md)
- [CortexIngestRequest](interfaces/CortexIngestRequest.md)
- [CortexIngestResponse](interfaces/CortexIngestResponse.md)
- [CredentialIssuer](interfaces/CredentialIssuer.md)
- [CredentialProof](interfaces/CredentialProof.md)
- [CredentialSubject](interfaces/CredentialSubject.md)
- [CrxComplianceCheckRequest](interfaces/CrxComplianceCheckRequest.md)
- [CrxComplianceCheckResponse](interfaces/CrxComplianceCheckResponse.md)
- [CrxPermitCreateRequest](interfaces/CrxPermitCreateRequest.md)
- [CrxPermitResponse](interfaces/CrxPermitResponse.md)
- [CryptographicProof](interfaces/CryptographicProof.md)
- [CulturalContext](interfaces/CulturalContext.md)
- [CulturalRecommendation](interfaces/CulturalRecommendation.md)
- [CustodyChain](interfaces/CustodyChain.md)
- [CustodyEntry](interfaces/CustodyEntry.md)
- [CustodyEvidence](interfaces/CustodyEvidence.md)
- [CustodyLocation](interfaces/CustodyLocation.md)
- [CustodyVerification](interfaces/CustodyVerification.md)
- [DecisionProvenance](interfaces/DecisionProvenance.md)
- [DeviceAttestation](interfaces/DeviceAttestation.md)
- [DeviceIdentity](interfaces/DeviceIdentity.md)
- [DigitalIdentity](interfaces/DigitalIdentity.md)
- [DomainEvent](interfaces/DomainEvent.md)
- [EnhancedIdentity](interfaces/EnhancedIdentity.md)
- [EntropyValidation](interfaces/EntropyValidation.md)
- [EnvironmentalInfo](interfaces/EnvironmentalInfo.md)
- [EscrowAccount](interfaces/EscrowAccount.md)
- [EventEnvelope](interfaces/EventEnvelope.md)
- [EventHandler](interfaces/EventHandler.md)
- [EventSubscription](interfaces/EventSubscription.md)
- [EvidenceRef](interfaces/EvidenceRef.md)
- [FilterParams](interfaces/FilterParams.md)
- [GciScoredData](interfaces/GciScoredData.md)
- [GciUpdatedData](interfaces/GciUpdatedData.md)
- [GeoCoordinates](interfaces/GeoCoordinates.md)
- [~~GeologicalContext~~](interfaces/GeologicalContext.md)
- [GeologicalInfo](interfaces/GeologicalInfo.md)
- [GeoPolygon](interfaces/GeoPolygon.md)
- [GeoTagData](interfaces/GeoTagData.md)
- [GeoTagProof](interfaces/GeoTagProof.md)
- [GeoTagRecordedData](interfaces/GeoTagRecordedData.md)
- [GeoTagSession](interfaces/GeoTagSession.md)
- [GeoTagVerifiedData](interfaces/GeoTagVerifiedData.md)
- [GtcxError](interfaces/GtcxError.md)
- [HealthCheck](interfaces/HealthCheck.md)
- [HealthResponse](interfaces/HealthResponse.md)
- [IdentityMetadata](interfaces/IdentityMetadata.md)
- [IdentityVerificationResult](interfaces/IdentityVerificationResult.md)
- [InfrastructureInfo](interfaces/InfrastructureInfo.md)
- [Insight](interfaces/Insight.md)
- [KeyDerivationParams](interfaces/KeyDerivationParams.md)
- [KeyPair](interfaces/KeyPair.md)
- [LocationClaim](interfaces/LocationClaim.md)
- [LocationProof](interfaces/LocationProof.md)
- [Lot](interfaces/Lot.md)
- [LotCertification](interfaces/LotCertification.md)
- [LotCompliance](interfaces/LotCompliance.md)
- [LotData](interfaces/LotData.md)
- [LotOrigin](interfaces/LotOrigin.md)
- [LotPricing](interfaces/LotPricing.md)
- [LotSpecifications](interfaces/LotSpecifications.md)
- [LotSummary](interfaces/LotSummary.md)
- [MethodologyVersion](interfaces/MethodologyVersion.md)
- [MultiKeyPairs](interfaces/MultiKeyPairs.md)
- [NotificationPreferences](interfaces/NotificationPreferences.md)
- [OrganizationRef](interfaces/OrganizationRef.md)
- [OriginCertificate](interfaces/OriginCertificate.md)
- [PaginatedResponse](interfaces/PaginatedResponse.md)
- [PaginationInfo](interfaces/PaginationInfo.md)
- [PaginationParams](interfaces/PaginationParams.md)
- [PanxVerifyRequest](interfaces/PanxVerifyRequest.md)
- [PanxVerifyResponse](interfaces/PanxVerifyResponse.md)
- [PaymentLeg](interfaces/PaymentLeg.md)
- [Permit](interfaces/Permit.md)
- [PermitAction](interfaces/PermitAction.md)
- [PermitApplicant](interfaces/PermitApplicant.md)
- [PermitCondition](interfaces/PermitCondition.md)
- [PermitDocument](interfaces/PermitDocument.md)
- [PermitFee](interfaces/PermitFee.md)
- [PermitScope](interfaces/PermitScope.md)
- [PermitWorkflow](interfaces/PermitWorkflow.md)
- [PhotoEvidence](interfaces/PhotoEvidence.md)
- [PhotoMetadata](interfaces/PhotoMetadata.md)
- [PolicyMetadata](interfaces/PolicyMetadata.md)
- [PolicyRegistry](interfaces/PolicyRegistry.md)
- [PriceQuote](interfaces/PriceQuote.md)
- [PrivacyPreferences](interfaces/PrivacyPreferences.md)
- [ProductionStats](interfaces/ProductionStats.md)
- [ProofMetadata](interfaces/ProofMetadata.md)
- [ProtocolEventDataMap](interfaces/ProtocolEventDataMap.md)
- [ProvenanceEvaluation](interfaces/ProvenanceEvaluation.md)
- [ProvenancePolicy](interfaces/ProvenancePolicy.md)
- [QuantitySpec](interfaces/QuantitySpec.md)
- [ReleaseCondition](interfaces/ReleaseCondition.md)
- [ResourceContext](interfaces/ResourceContext.md)
- [ResponseMeta](interfaces/ResponseMeta.md)
- [ReviewThreshold](interfaces/ReviewThreshold.md)
- [RoleConstraints](interfaces/RoleConstraints.md)
- [RoleDelegation](interfaces/RoleDelegation.md)
- [RouteCosts](interfaces/RouteCosts.md)
- [RuleCondition](interfaces/RuleCondition.md)
- [RuleResult](interfaces/RuleResult.md)
- [SealRecord](interfaces/SealRecord.md)
- [SettlementRecord](interfaces/SettlementRecord.md)
- [SettlementTimeline](interfaces/SettlementTimeline.md)
- [SettlementVerification](interfaces/SettlementVerification.md)
- [SgxListingCreateRequest](interfaces/SgxListingCreateRequest.md)
- [SgxListingResponse](interfaces/SgxListingResponse.md)
- [SgxOrderRequest](interfaces/SgxOrderRequest.md)
- [SgxOrderResponse](interfaces/SgxOrderResponse.md)
- [SgxTradeResponse](interfaces/SgxTradeResponse.md)
- [Site](interfaces/Site.md)
- [SiteCompliance](interfaces/SiteCompliance.md)
- [SiteIssue](interfaces/SiteIssue.md)
- [SiteLocation](interfaces/SiteLocation.md)
- [SiteMetadata](interfaces/SiteMetadata.md)
- [SiteOperator](interfaces/SiteOperator.md)
- [SiteReference](interfaces/SiteReference.md)
- [TradeMatch](interfaces/TradeMatch.md)
- [TradeOrder](interfaces/TradeOrder.md)
- [TradePassCredentialProof](interfaces/TradePassCredentialProof.md)
- [TradePassDID](interfaces/TradePassDID.md)
- [TradePassIdentity](interfaces/TradePassIdentity.md)
- [TradePassIssuedData](interfaces/TradePassIssuedData.md)
- [TradePassRevokedData](interfaces/TradePassRevokedData.md)
- [TradePassRole](interfaces/TradePassRole.md)
- [TradePassVerifiableCredential](interfaces/TradePassVerifiableCredential.md)
- [TradeRoute](interfaces/TradeRoute.md)
- [TradeTerms](interfaces/TradeTerms.md)
- [UIAdaptation](interfaces/UIAdaptation.md)
- [User](interfaces/User.md)
- [UserPreferences](interfaces/UserPreferences.md)
- [UserProfile](interfaces/UserProfile.md)
- [UserRole](interfaces/UserRole.md)
- [VaultLot](interfaces/VaultLot.md)
- [VerifiableCredential](interfaces/VerifiableCredential.md)
- [VerifierSignature](interfaces/VerifierSignature.md)
- [VerifierVote](interfaces/VerifierVote.md)
- [WeightRecord](interfaces/WeightRecord.md)
- [WorkflowApproval](interfaces/WorkflowApproval.md)
- [WorkflowEvent](interfaces/WorkflowEvent.md)
- [WorkflowStep](interfaces/WorkflowStep.md)
- [WorkforceInfo](interfaces/WorkforceInfo.md)

## Type Aliases

- [CertificationType](type-aliases/CertificationType.md)
- [CommodityType](type-aliases/CommodityType.md)
- [ComplianceTier](type-aliases/ComplianceTier.md)
- [ConditionOperator](type-aliases/ConditionOperator.md)
- [CryptoAlgorithm](type-aliases/CryptoAlgorithm.md)
- [CustodyAction](type-aliases/CustodyAction.md)
- [CustodyStatus](type-aliases/CustodyStatus.md)
- [DeliveryMethod](type-aliases/DeliveryMethod.md)
- [ErrorCode](type-aliases/ErrorCode.md)
- [EscrowStatus](type-aliases/EscrowStatus.md)
- [EventType](type-aliases/EventType.md)
- [FacilityType](type-aliases/FacilityType.md)
- [GeoTagProofType](type-aliases/GeoTagProofType.md)
- [LotStatus](type-aliases/LotStatus.md)
- [LotVisibility](type-aliases/LotVisibility.md)
- [MeasurementUnit](type-aliases/MeasurementUnit.md)
- [OrderStatus](type-aliases/OrderStatus.md)
- [OrganizationType](type-aliases/OrganizationType.md)
- [PaymentMethod](type-aliases/PaymentMethod.md)
- [PermitStatus](type-aliases/PermitStatus.md)
- [PermitType](type-aliases/PermitType.md)
- [PhotoCategory](type-aliases/PhotoCategory.md)
- [ProtocolEvent](type-aliases/ProtocolEvent.md)
- [ProvenancePolicyAction](type-aliases/ProvenancePolicyAction.md)
- [QualityGrade](type-aliases/QualityGrade.md)
- [ReviewThresholdCondition](type-aliases/ReviewThresholdCondition.md)
- [RuleType](type-aliases/RuleType.md)
- [SecurityLevel](type-aliases/SecurityLevel.md)
- [SettlementStatus](type-aliases/SettlementStatus.md)
- [SettlementType](type-aliases/SettlementType.md)
- [SiteStatus](type-aliases/SiteStatus.md)
- [SiteType](type-aliases/SiteType.md)
- [SwapStatus](type-aliases/SwapStatus.md)
- [TradePassRoleType](type-aliases/TradePassRoleType.md)
- [TrustLevel](type-aliases/TrustLevel.md)
- [UserStatus](type-aliases/UserStatus.md)
- [VaultCommodityForm](type-aliases/VaultCommodityForm.md)
- [VerificationMethod](type-aliases/VerificationMethod.md)

## Variables

- [DefaultReviewThresholds](variables/DefaultReviewThresholds.md)
- [PROTOCOL\_EVENT\_SUBJECTS](variables/PROTOCOL_EVENT_SUBJECTS.md)

## Functions

- [createResourceContext](functions/createResourceContext.md)
- [evaluateProvenancePolicy](functions/evaluateProvenancePolicy.md)
- [migrateGeologicalContext](functions/migrateGeologicalContext.md)
- [shouldRequireHumanReview](functions/shouldRequireHumanReview.md)
