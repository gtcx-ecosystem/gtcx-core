import { type Certificate, type StandardCertificate, type MilitaryGradeCertificate, type CertificateType, type CertificateMetadata, type CertificateLocation, type AssetLotData, type GoldLotData, type PhotoEvidenceRef, type ComplianceData, type EnvironmentalFactors, type ValidationMetrics, type ResourceContext, type GeologicalContext, type CommodityType } from '../types';
/**
 * Generate unique certificate ID
 */
export declare function generateCertificateId(type: CertificateType, prefix?: string): string;
/**
 * Input for creating a certificate - COMMODITY-AGNOSTIC
 */
export interface CreateCertificateInput {
    templateId: string;
    location: CertificateLocation;
    userRole: string;
    deviceId: string;
    /** Primary: commodity-agnostic asset lot data */
    assetLotData?: AssetLotData;
    /** @deprecated Use assetLotData instead */
    goldLotData?: GoldLotData;
    /** Commodity type (optional, can be inferred from assetLotData) */
    commodityType?: CommodityType;
    photoEvidence?: PhotoEvidenceRef[];
    workflowContext?: string;
    complianceData?: ComplianceData;
    /** Primary: commodity-agnostic resource context */
    resourceContext?: ResourceContext;
    /** @deprecated Use resourceContext instead */
    geologicalContext?: GeologicalContext;
    environmentalFactors?: EnvironmentalFactors;
    validationMetrics?: ValidationMetrics;
    expiresAt?: number;
}
/**
 * Validate certificate input against template rules
 */
export declare function validateCertificateInput(input: CreateCertificateInput): {
    valid: boolean;
    errors: string[];
};
/**
 * Create certificate metadata
 */
export declare function createCertificateMetadata(input: CreateCertificateInput, issuer?: string): CertificateMetadata;
/**
 * Create default environmental factors
 */
export declare function createDefaultEnvironmentalFactors(): EnvironmentalFactors;
/**
 * Create default validation metrics
 */
export declare function createDefaultValidationMetrics(): ValidationMetrics;
/**
 * Create a standard certificate structure (unsigned)
 * Caller must sign with appropriate crypto service
 */
export declare function createStandardCertificateData(input: CreateCertificateInput): Omit<StandardCertificate, 'signature'> & {
    dataToSign: string;
};
/**
 * Create a military-grade certificate structure (unsigned)
 * Caller must sign with multi-signature crypto service
 */
export declare function createMilitaryGradeCertificateData(input: CreateCertificateInput): Omit<MilitaryGradeCertificate, 'multiSignature' | 'quantumResistantHash'> & {
    dataToSign: string;
    dataForQuantumHash: string;
};
/**
 * Verify certificate structure (without cryptographic verification)
 * Cryptographic verification must be done by platform-specific code
 */
export declare function verifyCertificateStructure(certificate: Certificate): {
    valid: boolean;
    errors: string[];
};
/**
 * Check if certificate is expired
 */
export declare function isCertificateExpired(certificate: Certificate): boolean;
/**
 * Get certificate age in milliseconds
 */
export declare function getCertificateAge(certificate: Certificate): number;
/**
 * Format certificate for display
 */
export declare function formatCertificateForDisplay(certificate: Certificate): {
    id: string;
    type: string;
    securityLevel: string;
    issued: string;
    expires: string | null;
    location: string;
    issuer: string;
    commodityType?: string;
};
/**
 * Extract commodity type from certificate
 */
export declare function getCertificateCommodityType(certificate: Certificate): CommodityType | undefined;
//# sourceMappingURL=generator.d.ts.map