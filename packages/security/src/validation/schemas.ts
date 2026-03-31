/**
 * @gtcx/security - Validation Schemas
 *
 * Common Zod schemas for input validation at system boundaries.
 * Implements P2 (Type Safety) and P9 (Security by Design).
 */

import { z } from 'zod';

// =============================================================================
// IDENTITY SCHEMAS
// =============================================================================

/**
 * UUID v4 format
 */
export const UuidSchema = z.string().uuid();

/**
 * W3C Decentralized Identifier (DID)
 * Format: did:method:identifier
 */
export const DidSchema = z.string().regex(/^did:[a-z0-9]+:[a-zA-Z0-9._-]+$/, 'Invalid DID format');

/**
 * TradePass identifier
 * Format: tp_[uuid]
 */
export const TradePassIdSchema = z
  .string()
  .regex(
    /^tp_[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
    'Invalid TradePass ID format'
  );

/**
 * GeoTag identifier
 * Format: gt_[uuid]
 */
export const GeoTagIdSchema = z
  .string()
  .regex(
    /^gt_[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
    'Invalid GeoTag ID format'
  );

// =============================================================================
// CONTACT SCHEMAS
// =============================================================================

/**
 * Email address (RFC 5322)
 */
export const EmailSchema = z.string().email();

/**
 * Phone number (E.164 format)
 */
export const PhoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Phone must be E.164 format (e.g., +1234567890)');

/**
 * URL (http/https only)
 */
export const UrlSchema = z
  .string()
  .url()
  .refine(
    (url) => url.startsWith('http://') || url.startsWith('https://'),
    'URL must use http or https protocol'
  );

// =============================================================================
// TEMPORAL SCHEMAS
// =============================================================================

/**
 * ISO 8601 datetime string
 */
export const DateTimeSchema = z.string().datetime();

/**
 * Unix timestamp (milliseconds)
 */
export const TimestampSchema = z.number().int().positive();

/**
 * Duration in milliseconds
 */
export const DurationSchema = z.number().int().nonnegative();

// =============================================================================
// GEOGRAPHIC SCHEMAS
// =============================================================================

/**
 * Geographic coordinates
 */
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number().optional(),
  accuracy: z.number().positive().optional(),
});

/**
 * Bounding box [minLng, minLat, maxLng, maxLat]
 */
export const BoundingBoxSchema = z
  .tuple([
    z.number().min(-180).max(180), // minLng
    z.number().min(-90).max(90), // minLat
    z.number().min(-180).max(180), // maxLng
    z.number().min(-90).max(90), // maxLat
  ])
  .refine(
    ([minLng, minLat, maxLng, maxLat]) => minLng <= maxLng && minLat <= maxLat,
    'Invalid bounding box: min values must be less than max values'
  );

// =============================================================================
// CRYPTOGRAPHIC SCHEMAS
// =============================================================================

/**
 * Hex-encoded bytes (general)
 */
export const HexStringSchema = z
  .string()
  .max(10000)
  .regex(/^[a-fA-F0-9]+$/, 'Must be valid hexadecimal string');

/**
 * SHA-256 hash (64 hex chars)
 */
export const Hash256Schema = z
  .string()
  .regex(/^[a-fA-F0-9]{64}$/, 'Must be 64-character hex string (SHA-256)');

/**
 * Ed25519 public key (64 hex chars = 32 bytes)
 */
export const PublicKeySchema = z
  .string()
  .regex(/^[a-fA-F0-9]{64}$/, 'Must be 64-character hex string (Ed25519 public key)');

/**
 * Ed25519 signature (128 hex chars = 64 bytes)
 */
export const SignatureSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{128}$/, 'Must be 128-character hex string (Ed25519 signature)');

// =============================================================================
// COMMODITY SCHEMAS (P6 Asset Abstraction)
// =============================================================================

/**
 * Supported commodity types
 */
export const CommodityTypeSchema = z.enum([
  'gold',
  'silver',
  'platinum',
  'palladium',
  'rhodium',
  'cocoa',
  'coffee',
  'cotton',
  'sugar',
  'vanilla',
  'palm_oil',
  'rubber',
  'cobalt',
  'lithium',
  'copper',
  'tin',
  'tantalum',
  'tungsten',
  'diamond',
  'ruby',
  'emerald',
  'sapphire',
  'crude_oil',
  'natural_gas',
  'lng',
  'other',
]);

/**
 * Weight with unit
 */
export const WeightSchema = z.object({
  value: z.number().positive(),
  unit: z.enum(['g', 'kg', 'oz', 'lb', 'ct']), // ct = carat for gems
});

/**
 * Purity/fineness (0-1 or 0-1000)
 */
export const PuritySchema = z.number().min(0).max(1);

// =============================================================================
// PROTOCOL-SPECIFIC SCHEMAS
// =============================================================================

/**
 * GCI compliance score (0-100)
 */
export const ComplianceScoreSchema = z.number().min(0).max(100);

/**
 * PANX price data
 */
export const PriceDataSchema = z.object({
  commodity: CommodityTypeSchema,
  price: z.number().positive(),
  currency: z.string().length(3), // ISO 4217
  timestamp: DateTimeSchema,
  source: z.string(),
  confidence: z.number().min(0).max(1),
});

// =============================================================================
// COMMON SCHEMAS EXPORT
// =============================================================================

/**
 * Collection of common schemas for easy import
 */
export const CommonSchemas = {
  // Identity
  uuid: UuidSchema,
  did: DidSchema,
  tradePassId: TradePassIdSchema,
  geoTagId: GeoTagIdSchema,

  // Contact
  email: EmailSchema,
  phone: PhoneSchema,
  url: UrlSchema,

  // Temporal
  datetime: DateTimeSchema,
  timestamp: TimestampSchema,
  duration: DurationSchema,

  // Geographic
  coordinates: CoordinatesSchema,
  boundingBox: BoundingBoxSchema,

  // Cryptographic
  hexString: HexStringSchema,
  hash256: Hash256Schema,
  publicKey: PublicKeySchema,
  signature: SignatureSchema,

  // Commodity
  commodityType: CommodityTypeSchema,
  weight: WeightSchema,
  purity: PuritySchema,

  // Protocol
  complianceScore: ComplianceScoreSchema,
  priceData: PriceDataSchema,
} as const;

// =============================================================================
// SCHEMA UTILITIES
// =============================================================================

/**
 * Create a paginated response schema
 */
export function createPaginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive().max(100),
    hasMore: z.boolean(),
  });
}

/**
 * Create an API response schema with standard envelope
 */
export function createApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z
      .object({
        requestId: UuidSchema,
        timestamp: DateTimeSchema,
        version: z.string(),
      })
      .optional(),
  });
}

/**
 * Create an API error response schema
 */
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
  meta: z
    .object({
      requestId: UuidSchema,
      timestamp: DateTimeSchema,
    })
    .optional(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Uuid = z.infer<typeof UuidSchema>;
export type Did = z.infer<typeof DidSchema>;
export type TradePassId = z.infer<typeof TradePassIdSchema>;
export type GeoTagId = z.infer<typeof GeoTagIdSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Phone = z.infer<typeof PhoneSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type Hash256 = z.infer<typeof Hash256Schema>;
export type PublicKey = z.infer<typeof PublicKeySchema>;
export type Signature = z.infer<typeof SignatureSchema>;
export type CommodityType = z.infer<typeof CommodityTypeSchema>;
export type Weight = z.infer<typeof WeightSchema>;
export type PriceData = z.infer<typeof PriceDataSchema>;
