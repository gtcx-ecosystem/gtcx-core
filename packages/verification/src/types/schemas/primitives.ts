// ============================================================================
// PRIMITIVE SCHEMAS
// Location, site, asset lot, and QR code primitives used by higher-order
// entity schemas.
// ============================================================================

import { z } from 'zod';

import {
  AssetCategorySchema,
  AssetLifecycleStateSchema,
  CommodityTypeSchema,
  MeasurementUnitSchema,
  OperatorRoleSchema,
  QualityGradeSchema,
  SiteCategorySchema,
  SiteTypeSchema,
} from './enums';

// ============================================================================
// LOCATION & ENVIRONMENTAL SCHEMAS
// ============================================================================

export const CertificateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number().optional(),
  accuracy: z.number().positive(),
  timestamp: z.number().int().positive(),
});

export const EnvironmentalFactorsSchema = z.object({
  satelliteCount: z.number().int().nonnegative(),
  signalStrength: z.number().min(0).max(100),
  atmosphericConditions: z.string().min(1),
  multipathIndicator: z.boolean(),
});

export const ValidationMetricsSchema = z.object({
  isJammed: z.boolean(),
  isSpoofed: z.boolean(),
  confidenceLevel: z.number().min(0).max(1),
  integrityCheck: z.boolean(),
});

export const ResourceContextSchema = z.object({
  commodityPotential: z.enum(['high', 'medium', 'low', 'none']),
  commodityType: CommodityTypeSchema.optional(),
  formation: z.string().optional(),
  confidence: z.number().min(0).max(1),
  source: z.string().optional(),
});

// ============================================================================
// SITE SCHEMAS
// ============================================================================

export const SiteReferenceSchema = z.object({
  siteId: z.string().min(1),
  name: z.string().min(1),
  category: SiteCategorySchema.optional(),
  siteType: SiteTypeSchema.optional(),
  region: z.string().min(1),
  country: z.string().min(1),
});

// ============================================================================
// ASSET LOT SCHEMAS
// ============================================================================

export const AssetLotDataSchema = z.object({
  lotId: z.string().optional(),
  commodityType: CommodityTypeSchema,
  commoditySubtype: z.string().optional(),
  category: AssetCategorySchema.optional(),
  estimatedWeight: z.number().positive(),
  unit: MeasurementUnitSchema,
  quality: QualityGradeSchema.optional(),
  purity: z.number().min(0).max(100).optional(),
  state: AssetLifecycleStateSchema.optional(),
  previousState: AssetLifecycleStateSchema.optional(),
  producerId: z.string().optional(),
  operatorRole: OperatorRoleSchema.optional(),
  discoveryDate: z.string().optional(),
  siteId: z.string().optional(),
  site: SiteReferenceSchema.optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
});

// ============================================================================
// QR CODE SCHEMAS
// ============================================================================

export const QRCodeMetadataSchema = z.object({
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  assetWeight: z.number().optional(),
  assetUnit: MeasurementUnitSchema.optional(),
  commodityType: CommodityTypeSchema.optional(),
  assetState: AssetLifecycleStateSchema.optional(),
  purity: z.number().optional(),
  producerId: z.string().optional(),
  operatorRole: OperatorRoleSchema.optional(),
});

export const QRCodeDataSchema = z.object({
  certificateId: z.string().min(1),
  verifyUrl: z.string().url(),
  hash: z.string().min(1),
  timestamp: z.number().int().positive(),
  type: z.enum(['location', 'photo', 'certificate', 'asset-lot']),
  metadata: QRCodeMetadataSchema.optional(),
});

export const GeneratedQRCodeSchema = z.object({
  id: z.string().min(1),
  data: QRCodeDataSchema,
  qrCodeUri: z.string().min(1),
  dataString: z.string().min(1),
  size: z.number().int().positive(),
  timestamp: z.number().int().positive(),
});

export const QRCodeVerificationResultSchema = z.object({
  isValid: z.boolean(),
  data: QRCodeDataSchema.optional(),
  error: z.string().optional(),
});
