import type { QRCodeData, GeneratedQRCode, QRCodeVerificationResult, CommodityType, MeasurementUnit, OperatorRole } from '../types';
/**
 * Configuration for QR code generation
 */
export interface QRCodeConfig {
    /** Base URL for verification endpoint */
    verifyBaseUrl: string;
    /** Default QR code size in pixels */
    defaultSize: number;
    /** Certificate ID pattern for validation */
    certificateIdPattern: RegExp;
    /** Maximum age for valid certificates (ms) */
    maxCertificateAge: number;
}
/**
 * Generate unique QR code ID
 */
export declare function generateQRCodeId(): string;
/**
 * Create QR code data structure for a location
 */
export declare function createLocationQRData(certificateId: string, location: {
    latitude: number;
    longitude: number;
}, hash: string, config?: Partial<QRCodeConfig>): QRCodeData;
/**
 * Create QR code data structure for a photo
 */
export declare function createPhotoQRData(certificateId: string, photoHash: string, location?: {
    latitude: number;
    longitude: number;
}, config?: Partial<QRCodeConfig>): QRCodeData;
/**
 * Create QR code data structure for an asset lot - COMMODITY-AGNOSTIC
 * Works for gold, silver, cocoa, coffee, or any other commodity
 */
export declare function createAssetLotQRData(certificateId: string, assetLotData: {
    weight: number;
    unit?: MeasurementUnit;
    purity?: number;
    commodityType: CommodityType;
    producerId?: string;
    operatorRole?: OperatorRole;
    location: {
        latitude: number;
        longitude: number;
    };
}, hash: string, config?: Partial<QRCodeConfig>): QRCodeData;
/**
 * @deprecated Use createAssetLotQRData instead
 * Legacy function for gold-specific lot QR codes
 */
export declare function createGoldLotQRData(certificateId: string, goldLotData: {
    weight: number;
    purity: number;
    miner: string;
    location: {
        latitude: number;
        longitude: number;
    };
}, hash: string, config?: Partial<QRCodeConfig>): QRCodeData;
/**
 * Create QR code data structure for a certificate - COMMODITY-AGNOSTIC
 */
export declare function createCertificateQRData(certificateData: {
    certificateId: string;
    issuedAt: number;
    location?: {
        latitude: number;
        longitude: number;
    };
    /** Primary: commodity-agnostic asset lot data */
    assetLotData?: {
        estimatedWeight?: number;
        unit?: MeasurementUnit;
        purity?: number;
        commodityType?: CommodityType;
        producerId?: string;
        operatorRole?: OperatorRole;
    };
    /** @deprecated Use assetLotData instead */
    goldLotData?: {
        estimatedWeight?: number;
        purity?: number;
        miner?: string;
    };
}, proofHash: string, config?: Partial<QRCodeConfig>): QRCodeData;
/**
 * Serialize QR code data to string
 */
export declare function serializeQRData(data: QRCodeData): string;
/**
 * Parse QR code data from string
 */
export declare function parseQRData(dataString: string): QRCodeData | null;
/**
 * Verify QR code data structure and integrity
 */
export declare function verifyQRCodeData(qrCodeData: string | QRCodeData, config?: Partial<QRCodeConfig>): QRCodeVerificationResult;
/**
 * Create a GeneratedQRCode structure (without image - platform adapter adds that)
 */
export declare function createQRCodeStructure(data: QRCodeData, size?: number): Omit<GeneratedQRCode, 'qrCodeUri'>;
/**
 * Generate data hash for QR code content
 */
export declare function hashQRCodeContent(content: unknown): string;
/**
 * Extract commodity type from QR code data
 */
export declare function getQRCodeCommodityType(data: QRCodeData): CommodityType | undefined;
//# sourceMappingURL=generator.d.ts.map