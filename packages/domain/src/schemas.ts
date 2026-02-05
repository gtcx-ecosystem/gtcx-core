/**
 * Domain Validation Schemas
 *
 * Zod schemas for runtime validation at all service boundaries.
 * Implements P2 (Type Safety) and P9 (Security) principles.
 *
 * @package @gtcx/domain
 */

import { z } from 'zod';

// ============================================================================
// UTILITY
// ============================================================================

/**
 * Safe parse utility - wraps Zod safeParse with consistent typing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeParse<T>(schema: z.ZodType<T>, data: any): z.SafeParseReturnType<unknown, T> {
  return schema.safeParse(data);
}

// ============================================================================
// PRIMITIVE SCHEMAS
// ============================================================================

/** UUID v4 format */
export const UuidSchema = z.string().uuid();

/** ISO 8601 date string */
export const IsoDateSchema = z.string().datetime();

/** Positive number (weight, quantity, price) */
export const PositiveNumberSchema = z.number().positive();

/** Non-negative number */
export const NonNegativeNumberSchema = z.number().nonnegative();

/** Percentage (0-100) */
export const PercentageSchema = z.number().min(0).max(100);

/** Currency code (ISO 4217) */
export const CurrencyCodeSchema = z.string().length(3).toUpperCase();

/** Commodity type identifier */
export const CommodityTypeSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-z_]+$/);

// ============================================================================
// LOCATION SCHEMAS
// ============================================================================

export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number().optional(),
  accuracy: z.number().positive().max(1000), // Max 1km accuracy
  timestamp: z.number().positive(),
  source: z.enum(['gps', 'network', 'manual']).optional(),
});

// ============================================================================
// PHOTO EVIDENCE SCHEMAS
// ============================================================================

export const PhotoMetadataSchema = z.object({
  uri: z.string().min(1),
  hash: z.string().min(32).max(128).optional(),
  timestamp: z.number().positive(),
  location: LocationSchema.optional(),
  category: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
});

export const PhotoEvidenceArraySchema = z.array(PhotoMetadataSchema).min(1).max(20);

// ============================================================================
// CRYPTO PROOF SCHEMAS
// ============================================================================

export const CryptoProofSchema = z.object({
  hash: z.string().min(32).max(128),
  signature: z.string().min(32).max(256),
  publicKey: z.string().min(32).max(128),
  algorithm: z.string().max(50),
  timestamp: z.number().positive(),
});

// ============================================================================
// ASSET REGISTRATION SCHEMAS (P2 + P9)
// ============================================================================

export const AssetDetailsSchema = z.record(z.string(), z.unknown()).refine(
  (data) => {
    // Prevent dangerous keys
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    return !Object.keys(data).some((key) => dangerousKeys.includes(key));
  },
  { message: 'Invalid object keys detected' }
);

export const AssetRegistrationDataSchema = z.object({
  // Required fields
  commodityType: CommodityTypeSchema,
  producerId: UuidSchema,
  discoveryLocation: LocationSchema,
  photos: PhotoEvidenceArraySchema,
  estimatedWeight: PositiveNumberSchema.max(1000000), // Max 1M units
  weightUnit: z.enum(['g', 'kg', 'oz', 'lb', 'ton']),

  // Optional fields
  form: z.string().max(50).optional(),
  quality: z.enum(['high', 'medium', 'low', 'unknown']).optional(),
  purity: PercentageSchema.optional(),
  discoveryDate: IsoDateSchema.optional(),
  notes: z.string().max(2000).optional(),
  assetDetails: AssetDetailsSchema.optional(),

  // Metadata
  deviceId: z.string().max(100).optional(),
  appVersion: z.string().max(20).optional(),
});

export const PartialRegistrationDataSchema = AssetRegistrationDataSchema.partial();

// ============================================================================
// TRADING SCHEMAS (P2 + P9)
// ============================================================================

export const TraderIdSchema = UuidSchema;

export const PaymentMethodSchema = z.enum([
  'cash',
  'mobile_money',
  'bank_transfer',
  'escrow',
  'letter_of_credit',
]);

export const TradeRequestSchema = z.object({
  // Required fields
  assetLotId: UuidSchema,
  sellerId: TraderIdSchema,
  buyerId: TraderIdSchema,
  quantity: PositiveNumberSchema,
  agreedPrice: PositiveNumberSchema,
  currency: CurrencyCodeSchema,
  paymentMethod: PaymentMethodSchema,

  // Optional fields
  location: LocationSchema.optional(),
  notes: z.string().max(1000).optional(),

  // Security fields
  requestId: UuidSchema.optional(), // Idempotency key
  timestamp: z.number().positive().optional(),
});

export const TradingOpportunityFilterSchema = z.object({
  commodityType: CommodityTypeSchema.optional(),
  minPurity: PercentageSchema.optional(),
  maxPurity: PercentageSchema.optional(),
  minWeight: PositiveNumberSchema.optional(),
  maxWeight: PositiveNumberSchema.optional(),
  minPrice: NonNegativeNumberSchema.optional(),
  maxPrice: PositiveNumberSchema.optional(),
  location: CoordinatesSchema.optional(),
  radiusKm: PositiveNumberSchema.max(500).optional(),
  forms: z.array(z.string().max(50)).max(10).optional(),
});

// ============================================================================
// COMPLIANCE SCHEMAS (P2 + P9)
// ============================================================================

export const ComplianceSeveritySchema = z.enum(['critical', 'high', 'medium', 'low']);

export const ComplianceStatusSchema = z.enum([
  'compliant',
  'warning',
  'violation',
  'pending_review',
  'exempted',
]);

export const ComplianceCategorySchema = z.enum([
  'licensing',
  'environmental',
  'financial',
  'operational',
  'export',
  'safety',
]);

export const ComplianceReportOptionsSchema = z.object({
  dateRange: z
    .object({
      start: IsoDateSchema,
      end: IsoDateSchema,
    })
    .refine((data) => new Date(data.start) <= new Date(data.end), {
      message: 'Start date must be before or equal to end date',
    }),
  apps: z.array(z.string().max(50)).max(20).optional(),
  categories: z.array(ComplianceCategorySchema).optional(),
  severity: z.array(ComplianceSeveritySchema).optional(),
  format: z.enum(['summary', 'detailed', 'export']),
});

// ============================================================================
// CONFIGURATION SCHEMAS
// ============================================================================

export const RegistrationConfigSchema = z
  .object({
    minGpsAccuracy: PositiveNumberSchema.max(100).default(10),
    minPhotos: z.number().int().min(1).max(10).default(2),
    maxPhotos: z.number().int().min(1).max(20).default(10),
    maxDiscoveryAgeDays: z.number().int().min(1).max(365).default(30),
    requiredPhotoCategories: z.array(z.string()).optional(),
    workflowSteps: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          required: z.boolean(),
        })
      )
      .optional(),
  })
  .partial();

export const TradingConfigSchema = z
  .object({
    defaultCurrency: CurrencyCodeSchema.default('USD'),
    defaultSpread: PercentageSchema.default(2.5),
    sellerMarkup: PercentageSchema.default(5),
    highValueThreshold: PositiveNumberSchema.default(10000),
    maxTransactionValue: PositiveNumberSchema.optional(),
  })
  .partial();

export const ComplianceConfigSchema = z
  .object({
    defaultJurisdiction: z.string().max(50).default('international'),
    supportedCommodities: z.array(CommodityTypeSchema).default(['gold']),
    highValueThreshold: PositiveNumberSchema.default(10000),
    defaultCurrency: CurrencyCodeSchema.default('USD'),
  })
  .partial();

// ============================================================================
// TYPE EXPORTS (Inferred from Zod schemas)
// ============================================================================

export type AssetRegistrationInput = z.infer<typeof AssetRegistrationDataSchema>;
export type PartialRegistrationInput = z.infer<typeof PartialRegistrationDataSchema>;
export type TradeRequestInput = z.infer<typeof TradeRequestSchema>;
export type TradingOpportunityFilter = z.infer<typeof TradingOpportunityFilterSchema>;
export type ComplianceReportOptions = z.infer<typeof ComplianceReportOptionsSchema>;
export type RegistrationConfigInput = z.infer<typeof RegistrationConfigSchema>;
export type TradingConfigInput = z.infer<typeof TradingConfigSchema>;
export type ComplianceConfigInput = z.infer<typeof ComplianceConfigSchema>;

// Validated type aliases (used by service modules after safeParse succeeds)
export type ValidatedRegistrationData = AssetRegistrationInput;
export type ValidatedTradeRequest = TradeRequestInput;
export type ValidatedComplianceReportOptions = ComplianceReportOptions;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate and sanitize input data
 * @throws ZodError if validation fails
 */
export function validateRegistrationData(data: unknown): AssetRegistrationInput {
  return AssetRegistrationDataSchema.parse(data);
}

export function validatePartialRegistrationData(data: unknown): PartialRegistrationInput {
  return PartialRegistrationDataSchema.parse(data);
}

export function validateTradeRequest(data: unknown): TradeRequestInput {
  return TradeRequestSchema.parse(data);
}

export function validateTradingFilter(data: unknown): TradingOpportunityFilter {
  return TradingOpportunityFilterSchema.parse(data);
}

export function validateComplianceReportOptions(data: unknown): ComplianceReportOptions {
  return ComplianceReportOptionsSchema.parse(data);
}

/**
 * Safe validation that returns result instead of throwing
 */
export function safeValidateRegistrationData(data: unknown) {
  return AssetRegistrationDataSchema.safeParse(data);
}

export function safeValidateTradeRequest(data: unknown) {
  return TradeRequestSchema.safeParse(data);
}
