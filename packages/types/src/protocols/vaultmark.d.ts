/**
 * Chain of custody record
 */
export interface CustodyChain {
    id: string;
    lotId: string;
    entries: CustodyEntry[];
    currentHolder: string;
    status: CustodyStatus;
    createdAt: number;
    updatedAt: number;
}
export type CustodyStatus = 'active' | 'transferred' | 'sealed' | 'released' | 'disputed';
/**
 * Individual custody entry
 */
export interface CustodyEntry {
    id: string;
    chainId: string;
    fromHolder?: string;
    toHolder: string;
    timestamp: number;
    location: CustodyLocation;
    action: CustodyAction;
    evidence: CustodyEvidence;
    verification: CustodyVerification;
}
export type CustodyAction = 'receive' | 'transfer' | 'store' | 'process' | 'seal' | 'unseal' | 'inspect' | 'release';
export interface CustodyLocation {
    facilityId: string;
    facilityName: string;
    facilityType: FacilityType;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    address?: string;
}
export type FacilityType = 'mine_site' | 'collection_point' | 'transport' | 'processing' | 'refinery' | 'vault' | 'customs' | 'exchange';
export interface CustodyEvidence {
    photos: string[];
    documents: string[];
    seals?: SealRecord[];
    weight?: WeightRecord;
    notes?: string;
}
export interface SealRecord {
    sealId: string;
    sealType: 'physical' | 'digital' | 'dual';
    appliedAt: number;
    appliedBy: string;
    verifiedAt?: number;
    brokenAt?: number;
    reason?: string;
}
export interface WeightRecord {
    gross: number;
    tare: number;
    net: number;
    unit: 'g' | 'kg' | 'oz' | 'troy_oz';
    measuredAt: number;
    measuredBy: string;
    equipment?: string;
    calibrationDate?: string;
}
export interface CustodyVerification {
    verifierId: string;
    verifiedAt: number;
    method: VerificationMethod;
    result: 'verified' | 'failed' | 'pending';
    signature: string;
    notes?: string;
}
export type VerificationMethod = 'visual' | 'weight' | 'assay' | 'seal_check' | 'documentation' | 'biometric';
/**
 * Lot record - physical asset being tracked
 */
export interface VaultLot {
    id: string;
    commodity: CommodityType;
    origin: LotOrigin;
    currentCustody: CustodyChain;
    specifications: LotSpecifications;
    certifications: string[];
    status: LotStatus;
    createdAt: number;
    updatedAt: number;
}
export type CommodityType = 'gold_dore' | 'gold_refined' | 'gold_ore' | 'silver' | 'platinum' | 'palladium' | 'coltan' | 'cobalt' | 'other';
export interface LotOrigin {
    siteId: string;
    siteName: string;
    region: string;
    country: string;
    extractionDate: string;
    extractedBy: string;
    originCertificate?: string;
}
export interface LotSpecifications {
    weight: WeightRecord;
    purity?: number;
    assayReport?: string;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    form?: 'bar' | 'nugget' | 'dust' | 'ore' | 'concentrate';
}
export type LotStatus = 'registered' | 'verified' | 'in_transit' | 'stored' | 'processing' | 'listed' | 'traded' | 'settled';
//# sourceMappingURL=vaultmark.d.ts.map