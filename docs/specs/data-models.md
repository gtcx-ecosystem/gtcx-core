# Section 7: Data Models and Schemas

## Document Control

| Attribute              | Value                        |
| ---------------------- | ---------------------------- |
| **Section**            | 7 of 14                      |
| **Title**              | Data Models and Schemas      |
| **Status**             | Publication-Ready            |
| **Primary Principles** | P1, P2, P3, P6, P7, P10, P11 |

---

## 7.1 Overview

This section defines the complete data model specification for GTCX Protocol v3.0, providing:

- **Type-safe schemas** using Zod for runtime validation
- **Commodity-agnostic design** via configurable asset registry
- **Schema versioning** with migration paths
- **Multi-commodity examples** (gold, coffee, cobalt, timber)

### Design Philosophy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DATA MODEL DESIGN PRINCIPLES                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. TYPE SAFETY FIRST                                                   │
│     Every external input validated with Zod at runtime                  │
│     Zero `any` types in production code                                 │
│                                                                         │
│  2. COMMODITY AGNOSTIC                                                  │
│     Zero hardcoded commodity references                                 │
│     All asset types defined via configuration                           │
│                                                                         │
│  3. EVOLUTION READY                                                     │
│     All schemas versioned semantically                                  │
│     Migration paths for all breaking changes                            │
│                                                                         │
│  4. DOCUMENTATION EMBEDDED                                              │
│     JSDoc on all public types                                           │
│     Examples for every schema                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7.2 Schema Organization

### 7.2.1 Package Structure

```
@gtcx/schemas/
├── core/                    # Foundation types
│   ├── primitives.ts        # Base types (DID, UUID, timestamps)
│   ├── common.ts            # Shared types (coordinates, addresses)
│   └── errors.ts            # Error schemas
│
├── identity/                # TradePass™ schemas
│   ├── did.ts               # DID document schemas
│   ├── credentials.ts       # Verifiable credentials
│   ├── biometrics.ts        # Biometric templates
│   └── roles.ts             # Role definitions
│
├── assets/                  # Asset schemas
│   ├── registry.ts          # Asset type registry
│   ├── identity.ts          # Asset identity
│   ├── custody.ts           # Custody chain
│   └── verification.ts      # Verification records
│
├── compliance/              # GCI™ schemas
│   ├── scoring.ts           # Score calculations
│   ├── factors.ts           # Factor definitions
│   └── appeals.ts           # Appeal process
│
├── location/                # GeoTag™ schemas
│   ├── capture.ts           # Location capture
│   ├── credentials.ts       # Location credentials
│   └── anomalies.ts         # Anomaly detection
│
├── settlement/              # PvP™ schemas
│   ├── escrow.ts            # Escrow records
│   ├── payment.ts           # Payment types
│   └── disputes.ts          # Dispute resolution
│
├── consensus/               # PANX™ schemas
│   ├── requests.ts          # Consensus requests
│   ├── votes.ts             # Validator votes
│   └── results.ts           # Consensus results
│
├── config/                  # Configuration schemas
│   ├── commodities/         # Per-commodity configs
│   │   ├── gold.ts
│   │   ├── coffee.ts
│   │   ├── cobalt.ts
│   │   └── timber.ts
│   └── jurisdictions/       # Per-jurisdiction configs
│
├── migrations/              # Schema migrations
│   ├── registry.ts          # Version registry
│   ├── executor.ts          # Migration executor
│   └── versions/            # Version-specific migrations
│
└── index.ts                 # Public exports
```

### 7.2.2 Import Conventions

```typescript
// Correct: Import from package root
import { AssetIdentitySchema, TradePassDIDDocumentSchema, GCIOutputSchema } from '@gtcx/schemas';

// Correct: Import specific subpackage for advanced use
import { AssetRegistry } from '@gtcx/schemas/assets';
import { MigrationExecutor } from '@gtcx/schemas/migrations';

// Incorrect: Never import from internal paths
// import { ... } from '@gtcx/schemas/core/primitives';
```

---

## 7.3 Core Primitives

### 7.3.1 Base Types

```typescript
// core/primitives.ts
import { z } from 'zod';

/**
 * GTCX Decentralized Identifier
 * Format: did:gtcx:<type>_<hash>
 *
 * @example "did:gtcx:tp_a1b2c3d4e5f67890"
 * @example "did:gtcx:va_9876543210fedcba"
 */
export const GTCXDIDSchema = z
  .string()
  .regex(
    /^did:gtcx:[a-z]{2}_[a-f0-9]{16,32}$/,
    'Invalid GTCX DID format. Expected: did:gtcx:<type>_<hash>'
  );

/**
 * DID Types
 */
export const DIDTypeSchema = z.enum([
  'tp', // TradePass (identity)
  'va', // Validator
  'as', // Asset
  'es', // Escrow
  'cr', // Credential
  'gt', // GeoTag
  'vm', // VaultMark
]);

export type DIDType = z.infer<typeof DIDTypeSchema>;

/**
 * UUID v4 format
 */
export const UUIDSchema = z.string().uuid();

/**
 * ISO 8601 datetime with timezone
 */
export const DateTimeSchema = z.string().datetime({ offset: true });

/**
 * ISO 8601 date only
 */
export const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Expected: YYYY-MM-DD');

/**
 * ISO 3166-1 alpha-2 country code
 */
export const CountryCodeSchema = z.string().length(2).toUpperCase();

/**
 * ISO 4217 currency code
 */
export const CurrencyCodeSchema = z.string().length(3).toUpperCase();

/**
 * Semantic version
 */
export const SemVerSchema = z
  .string()
  .regex(
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?$/,
    'Invalid semantic version. Expected: MAJOR.MINOR.PATCH'
  );

/**
 * Ed25519 signature (base64)
 */
export const SignatureSchema = z
  .string()
  .regex(/^[A-Za-z0-9+/]{86}==$/, 'Invalid Ed25519 signature format');

/**
 * SHA-256 hash with prefix
 */
export const SHA256HashSchema = z
  .string()
  .regex(/^sha256:[a-f0-9]{64}$/, 'Invalid SHA-256 hash format. Expected: sha256:<64-hex-chars>');

/**
 * Multibase-encoded public key
 */
export const PublicKeyMultibaseSchema = z
  .string()
  .regex(/^z[1-9A-HJ-NP-Za-km-z]+$/, 'Invalid multibase public key');
```

### 7.3.2 Common Types

```typescript
// core/common.ts
import { z } from 'zod';

/**
 * Geographic coordinates (WGS84)
 */
export const CoordinatesSchema = z.object({
  /** Latitude in decimal degrees (-90 to 90) */
  latitude: z.number().min(-90).max(90),

  /** Longitude in decimal degrees (-180 to 180) */
  longitude: z.number().min(-180).max(180),

  /** Altitude in meters above sea level */
  altitude: z.number().optional(),

  /** Horizontal accuracy in meters */
  accuracy: z.number().positive().optional(),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

/**
 * Geohash for spatial indexing
 * @see https://en.wikipedia.org/wiki/Geohash
 */
export const GeohashSchema = z.string().regex(/^[0-9b-hjkmnp-z]{1,12}$/, 'Invalid geohash format');

/**
 * Monetary amount with currency
 */
export const MoneySchema = z.object({
  /** Amount value (supports up to 8 decimal places for crypto) */
  value: z.number().nonnegative(),

  /** ISO 4217 currency code */
  currency: CurrencyCodeSchema,

  /** Decimal precision for display */
  precision: z.number().int().min(0).max(8).default(2),
});

export type Money = z.infer<typeof MoneySchema>;

/**
 * Weight measurement
 */
export const WeightSchema = z.object({
  /** Numeric value */
  value: z.number().positive(),

  /** Unit of measurement */
  unit: z.enum(['g', 'kg', 'oz', 'lb', 'mt']),
});

export type Weight = z.infer<typeof WeightSchema>;

/**
 * Physical address
 */
export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: CountryCodeSchema,
});

export type Address = z.infer<typeof AddressSchema>;

/**
 * Contact information
 */
export const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/)
    .optional(),
  email: z.string().email().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

/**
 * Pagination parameters
 */
export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  cursor: z.string().optional(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Paginated response wrapper
 */
export function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
    offset: z.number().int().nonnegative(),
    hasMore: z.boolean(),
    nextCursor: z.string().optional(),
  });
}
```

---

## 7.4 Asset Registry

### 7.4.1 Asset Type Definition

```typescript
// assets/registry.ts
import { z } from 'zod';

/**
 * Asset type configuration
 * Defines how each commodity type is handled in the system
 */
export const AssetTypeConfigSchema = z.object({
  /** Unique identifier for this asset type */
  typeId: z.string().regex(/^[a-z][a-z0-9_]{1,19}$/),

  /** Human-readable name */
  displayName: z.string().min(1).max(100),

  /** Asset category */
  category: z.enum([
    'precious_metals',
    'agricultural',
    'critical_minerals',
    'forestry',
    'fisheries',
    'energy',
  ]),

  /** Primary unit of measurement */
  primaryUnit: z.enum(['g', 'kg', 'oz', 'lb', 'mt', 'L', 'm3', 'units']),

  /** Required attributes for this asset type */
  requiredAttributes: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['string', 'number', 'boolean', 'date', 'enum']),
      validation: z.record(z.string(), z.unknown()).optional(),
      description: z.string(),
    })
  ),

  /** Optional attributes */
  optionalAttributes: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(['string', 'number', 'boolean', 'date', 'enum']),
        validation: z.record(z.string(), z.unknown()).optional(),
        description: z.string(),
        default: z.unknown().optional(),
      })
    )
    .default([]),

  /** Verification requirements */
  verifications: z.object({
    /** Required verification types */
    required: z.array(
      z.enum([
        'origin',
        'quality',
        'weight',
        'purity',
        'assay',
        'esg',
        'custody',
        'labor',
        'environmental',
        'legal',
      ])
    ),

    /** Optional verifications for premium status */
    premium: z.array(z.string()).default([]),
  }),

  /** GCI weight configuration */
  gciWeights: z
    .object({
      environmental: z.number().min(0).max(1),
      safety: z.number().min(0).max(1),
      financial: z.number().min(0).max(1),
      social: z.number().min(0).max(1),
      regulatory: z.number().min(0).max(1),
    })
    .refine(
      (w) =>
        Math.abs(w.environmental + w.safety + w.financial + w.social + w.regulatory - 1) < 0.001,
      'GCI weights must sum to 1.0'
    ),

  /** Custody state configuration */
  custodyStates: z.array(
    z.object({
      state: z.string(),
      description: z.string(),
      allowedTransitions: z.array(z.string()),
      requiredVerifications: z.array(z.string()).default([]),
    })
  ),

  /** Jurisdiction-specific overrides */
  jurisdictionOverrides: z
    .record(
      CountryCodeSchema,
      z.object({
        gciWeights: z
          .object({
            environmental: z.number(),
            safety: z.number(),
            financial: z.number(),
            social: z.number(),
            regulatory: z.number(),
          })
          .partial()
          .optional(),
        additionalVerifications: z.array(z.string()).optional(),
        custodyStateOverrides: z
          .array(
            z.object({
              state: z.string(),
              requiredVerifications: z.array(z.string()),
            })
          )
          .optional(),
      })
    )
    .optional(),

  /** Active status */
  active: z.boolean().default(true),

  /** Schema version */
  version: SemVerSchema,
});

export type AssetTypeConfig = z.infer<typeof AssetTypeConfigSchema>;
```

### 7.4.2 Commodity Configurations

#### Gold Configuration

```typescript
// config/commodities/gold.ts
import { AssetTypeConfig } from '../registry';

export const GoldConfig: AssetTypeConfig = {
  typeId: 'gold',
  displayName: 'Gold',
  category: 'precious_metals',
  primaryUnit: 'g',

  requiredAttributes: [
    {
      name: 'weightGrams',
      type: 'number',
      validation: { min: 0.01, max: 1000000 },
      description: 'Weight in grams',
    },
    {
      name: 'purityPercentage',
      type: 'number',
      validation: { min: 0, max: 100 },
      description: 'Gold purity as percentage (e.g., 99.5 for 99.5%)',
    },
  ],

  optionalAttributes: [
    {
      name: 'assayMethod',
      type: 'enum',
      validation: { values: ['fire-assay', 'xrf', 'icp-oes', 'cupellation'] },
      description: 'Method used for purity assay',
    },
    {
      name: 'form',
      type: 'enum',
      validation: { values: ['dust', 'nugget', 'bar', 'dore', 'concentrate'] },
      description: 'Physical form of gold',
      default: 'dore',
    },
    {
      name: 'mercuryFree',
      type: 'boolean',
      description: 'Whether gold was processed without mercury',
      default: false,
    },
  ],

  verifications: {
    required: ['origin', 'weight', 'purity', 'custody'],
    premium: ['assay', 'esg', 'environmental', 'labor'],
  },

  gciWeights: {
    environmental: 0.3, // Mercury use, land rehabilitation
    safety: 0.25, // Mining safety, PPE
    financial: 0.2, // Record keeping, taxes
    social: 0.1, // Community benefit, labor
    regulatory: 0.15, // Licensing, export compliance
  },

  custodyStates: [
    {
      state: 'origin',
      description: 'At mine site',
      allowedTransitions: ['producer'],
      requiredVerifications: ['origin'],
    },
    {
      state: 'producer',
      description: 'In producer custody',
      allowedTransitions: ['aggregator', 'vault'],
      requiredVerifications: ['weight'],
    },
    {
      state: 'aggregator',
      description: 'At buying station/RCO',
      allowedTransitions: ['vault', 'refiner'],
      requiredVerifications: ['weight', 'purity'],
    },
    {
      state: 'vault',
      description: 'In secure vault custody',
      allowedTransitions: ['refiner', 'buyer'],
      requiredVerifications: ['weight', 'purity', 'custody'],
    },
    {
      state: 'refiner',
      description: 'At refinery',
      allowedTransitions: ['final'],
      requiredVerifications: ['weight', 'purity', 'assay'],
    },
    {
      state: 'final',
      description: 'Final refined product',
      allowedTransitions: [],
      requiredVerifications: [],
    },
  ],

  jurisdictionOverrides: {
    GH: {
      additionalVerifications: ['pmmc_clearance'],
    },
    CD: {
      gciWeights: {
        social: 0.2, // Higher weight for conflict-free verification
      },
      additionalVerifications: ['conflict_free', 'child_labor_free'],
    },
  },

  active: true,
  version: '3.0.0',
};
```

#### Coffee Configuration

```typescript
// config/commodities/coffee.ts
import { AssetTypeConfig } from '../registry';

export const CoffeeConfig: AssetTypeConfig = {
  typeId: 'coffee',
  displayName: 'Coffee',
  category: 'agricultural',
  primaryUnit: 'kg',

  requiredAttributes: [
    {
      name: 'weightKg',
      type: 'number',
      validation: { min: 0.1, max: 100000 },
      description: 'Weight in kilograms',
    },
    {
      name: 'variety',
      type: 'enum',
      validation: { values: ['arabica', 'robusta', 'liberica'] },
      description: 'Coffee variety',
    },
    {
      name: 'processingMethod',
      type: 'enum',
      validation: { values: ['washed', 'natural', 'honey', 'wet-hulled'] },
      description: 'Processing method used',
    },
  ],

  optionalAttributes: [
    {
      name: 'grade',
      type: 'string',
      validation: { pattern: '^[A-Z][0-9]?$' },
      description: 'Quality grade (e.g., A1, B2)',
    },
    {
      name: 'cuppingScore',
      type: 'number',
      validation: { min: 0, max: 100 },
      description: 'SCA cupping score',
    },
    {
      name: 'moistureContent',
      type: 'number',
      validation: { min: 0, max: 20 },
      description: 'Moisture content percentage',
    },
    {
      name: 'altitude',
      type: 'number',
      validation: { min: 0, max: 3000 },
      description: 'Growing altitude in meters',
    },
    {
      name: 'harvestYear',
      type: 'number',
      validation: { min: 2000, max: 2100 },
      description: 'Year of harvest',
    },
    {
      name: 'certification',
      type: 'enum',
      validation: { values: ['organic', 'fairtrade', 'rainforest', 'utz', 'none'] },
      description: 'Third-party certification',
      default: 'none',
    },
  ],

  verifications: {
    required: ['origin', 'quality', 'weight'],
    premium: ['cupping', 'certification', 'labor', 'environmental'],
  },

  gciWeights: {
    environmental: 0.2, // Sustainable farming, shade-grown
    safety: 0.15, // Handling, storage
    financial: 0.2, // Traceability, records
    social: 0.3, // Fair wages, community, labor
    regulatory: 0.15, // Export licenses, phytosanitary
  },

  custodyStates: [
    {
      state: 'farm_gate',
      description: 'At producer farm',
      allowedTransitions: ['washing_station'],
      requiredVerifications: ['origin'],
    },
    {
      state: 'washing_station',
      description: 'Primary processing',
      allowedTransitions: ['dry_mill'],
      requiredVerifications: ['weight', 'quality'],
    },
    {
      state: 'dry_mill',
      description: 'Secondary processing',
      allowedTransitions: ['export_warehouse'],
      requiredVerifications: ['weight', 'quality'],
    },
    {
      state: 'export_warehouse',
      description: 'Awaiting export',
      allowedTransitions: ['in_transit'],
      requiredVerifications: ['weight', 'cupping'],
    },
    {
      state: 'in_transit',
      description: 'International shipping',
      allowedTransitions: ['destination_port'],
      requiredVerifications: [],
    },
    {
      state: 'destination_port',
      description: 'Arrived at destination',
      allowedTransitions: ['roaster'],
      requiredVerifications: ['weight'],
    },
    {
      state: 'roaster',
      description: 'Final buyer',
      allowedTransitions: [],
      requiredVerifications: [],
    },
  ],

  jurisdictionOverrides: {
    RW: {
      additionalVerifications: ['naeb_approval'],
    },
    ET: {
      additionalVerifications: ['ece_clearance'],
    },
  },

  active: true,
  version: '3.0.0',
};
```

#### Cobalt Configuration

```typescript
// config/commodities/cobalt.ts
import { AssetTypeConfig } from '../registry';

export const CobaltConfig: AssetTypeConfig = {
  typeId: 'cobalt',
  displayName: 'Cobalt',
  category: 'critical_minerals',
  primaryUnit: 'kg',

  requiredAttributes: [
    {
      name: 'weightKg',
      type: 'number',
      validation: { min: 0.1, max: 1000000 },
      description: 'Weight in kilograms',
    },
    {
      name: 'purityPercentage',
      type: 'number',
      validation: { min: 0, max: 100 },
      description: 'Cobalt purity percentage',
    },
    {
      name: 'conflictFree',
      type: 'boolean',
      description: 'Certified conflict-free',
    },
    {
      name: 'childLaborFree',
      type: 'boolean',
      description: 'Verified child labor free',
    },
  ],

  optionalAttributes: [
    {
      name: 'oreType',
      type: 'enum',
      validation: { values: ['heterogenite', 'carrollite', 'cobaltite', 'mixed'] },
      description: 'Type of cobalt ore',
    },
    {
      name: 'esgScore',
      type: 'number',
      validation: { min: 0, max: 100 },
      description: 'ESG compliance score',
    },
    {
      name: 'rmiCompliant',
      type: 'boolean',
      description: 'RMI (Responsible Minerals Initiative) compliant',
      default: false,
    },
  ],

  verifications: {
    required: ['origin', 'weight', 'purity', 'labor', 'esg'],
    premium: ['rmi_audit', 'oecd_due_diligence'],
  },

  gciWeights: {
    environmental: 0.2, // Mining impact, water use
    safety: 0.3, // Critical for ASM safety
    financial: 0.15, // Traceability
    social: 0.25, // Child labor, community
    regulatory: 0.1, // Export compliance
  },

  custodyStates: [
    {
      state: 'mine_site',
      description: 'At artisanal mine site',
      allowedTransitions: ['depot'],
      requiredVerifications: ['origin', 'labor'],
    },
    {
      state: 'depot',
      description: 'At buying depot',
      allowedTransitions: ['processing'],
      requiredVerifications: ['weight', 'esg'],
    },
    {
      state: 'processing',
      description: 'At processing facility',
      allowedTransitions: ['refiner'],
      requiredVerifications: ['weight', 'purity'],
    },
    {
      state: 'refiner',
      description: 'At refinery',
      allowedTransitions: ['battery_manufacturer', 'export'],
      requiredVerifications: ['purity', 'esg'],
    },
    {
      state: 'battery_manufacturer',
      description: 'At battery manufacturer',
      allowedTransitions: [],
      requiredVerifications: [],
    },
    {
      state: 'export',
      description: 'Exported',
      allowedTransitions: [],
      requiredVerifications: [],
    },
  ],

  jurisdictionOverrides: {
    CD: {
      gciWeights: {
        social: 0.35, // Highest priority for child labor
        safety: 0.3,
      },
      additionalVerifications: ['child_labor_inspection', 'armed_group_check'],
    },
  },

  active: true,
  version: '3.0.0',
};
```

#### Timber Configuration

```typescript
// config/commodities/timber.ts
import { AssetTypeConfig } from '../registry';

export const TimberConfig: AssetTypeConfig = {
  typeId: 'timber',
  displayName: 'Timber',
  category: 'forestry',
  primaryUnit: 'm3',

  requiredAttributes: [
    {
      name: 'volumeM3',
      type: 'number',
      validation: { min: 0.01, max: 100000 },
      description: 'Volume in cubic meters',
    },
    {
      name: 'species',
      type: 'string',
      description: 'Tree species (scientific name)',
    },
    {
      name: 'legallyHarvested',
      type: 'boolean',
      description: 'Verified legally harvested',
    },
  ],

  optionalAttributes: [
    {
      name: 'grade',
      type: 'enum',
      validation: { values: ['A', 'B', 'C', 'D'] },
      description: 'Timber grade',
    },
    {
      name: 'moistureContent',
      type: 'number',
      validation: { min: 0, max: 100 },
      description: 'Moisture content percentage',
    },
    {
      name: 'fscCertified',
      type: 'boolean',
      description: 'FSC certification status',
      default: false,
    },
    {
      name: 'pefcCertified',
      type: 'boolean',
      description: 'PEFC certification status',
      default: false,
    },
    {
      name: 'concessionId',
      type: 'string',
      description: 'Forest concession identifier',
    },
  ],

  verifications: {
    required: ['origin', 'legal', 'environmental'],
    premium: ['fsc', 'pefc', 'deforestation_free'],
  },

  gciWeights: {
    environmental: 0.35, // Deforestation, biodiversity
    safety: 0.15, // Harvesting safety
    financial: 0.15, // Traceability
    social: 0.15, // Community rights, FPIC
    regulatory: 0.2, // Legal harvest, CITES, EUDR
  },

  custodyStates: [
    {
      state: 'standing',
      description: 'Standing timber (pre-harvest)',
      allowedTransitions: ['felled'],
      requiredVerifications: ['legal', 'environmental'],
    },
    {
      state: 'felled',
      description: 'Felled at harvest site',
      allowedTransitions: ['log_yard'],
      requiredVerifications: ['origin'],
    },
    {
      state: 'log_yard',
      description: 'At log yard/depot',
      allowedTransitions: ['sawmill', 'export_port'],
      requiredVerifications: ['volume'],
    },
    {
      state: 'sawmill',
      description: 'At sawmill processing',
      allowedTransitions: ['warehouse'],
      requiredVerifications: ['volume'],
    },
    {
      state: 'warehouse',
      description: 'In storage',
      allowedTransitions: ['export_port', 'domestic_buyer'],
      requiredVerifications: [],
    },
    {
      state: 'export_port',
      description: 'At export port',
      allowedTransitions: ['shipped'],
      requiredVerifications: ['legal'],
    },
    {
      state: 'shipped',
      description: 'In transit',
      allowedTransitions: [],
      requiredVerifications: [],
    },
    {
      state: 'domestic_buyer',
      description: 'Delivered to domestic buyer',
      allowedTransitions: [],
      requiredVerifications: [],
    },
  ],

  jurisdictionOverrides: {
    ZM: {
      additionalVerifications: ['zaffico_permit'],
    },
    CM: {
      additionalVerifications: ['minfof_permit'],
    },
  },

  active: true,
  version: '3.0.0',
};
```

### 7.4.3 Asset Registry Implementation

```typescript
// assets/registry.ts

/**
 * Asset Registry
 * Central registry for all supported commodity types
 */
export class AssetRegistry {
  private static configs: Map<string, AssetTypeConfig> = new Map();
  private static initialized = false;

  /**
   * Initialize registry with default configurations
   */
  static initialize(): void {
    if (this.initialized) return;

    // Register built-in commodity types
    this.register(GoldConfig);
    this.register(CoffeeConfig);
    this.register(CobaltConfig);
    this.register(TimberConfig);

    this.initialized = true;
  }

  /**
   * Register a new asset type
   */
  static register(config: AssetTypeConfig): void {
    const result = AssetTypeConfigSchema.safeParse(config);
    if (!result.success) {
      throw new SchemaValidationError(
        `Invalid asset type configuration for ${config.typeId}`,
        result.error
      );
    }

    this.configs.set(config.typeId, result.data);
  }

  /**
   * Check if asset type is registered
   */
  static isRegistered(typeId: string): boolean {
    this.ensureInitialized();
    return this.configs.has(typeId);
  }

  /**
   * Get configuration for asset type
   */
  static getConfig(typeId: string): AssetTypeConfig | undefined {
    this.ensureInitialized();
    return this.configs.get(typeId);
  }

  /**
   * Get all registered asset types
   */
  static getAllTypes(): string[] {
    this.ensureInitialized();
    return Array.from(this.configs.keys());
  }

  /**
   * Get asset types by category
   */
  static getByCategory(category: AssetTypeConfig['category']): AssetTypeConfig[] {
    this.ensureInitialized();
    return Array.from(this.configs.values()).filter((c) => c.category === category);
  }

  /**
   * Build Zod schema for asset attributes
   */
  static buildAttributeSchema(typeId: string): z.ZodObject<any> {
    const config = this.getConfig(typeId);
    if (!config) {
      throw new UnknownAssetTypeError(typeId);
    }

    const shape: Record<string, z.ZodTypeAny> = {};

    // Add required attributes
    for (const attr of config.requiredAttributes) {
      shape[attr.name] = this.buildAttributeValidator(attr);
    }

    // Add optional attributes
    for (const attr of config.optionalAttributes) {
      shape[attr.name] = this.buildAttributeValidator(attr).optional();
    }

    return z.object(shape);
  }

  private static buildAttributeValidator(attr: {
    name: string;
    type: string;
    validation?: Record<string, unknown>;
  }): z.ZodTypeAny {
    let validator: z.ZodTypeAny;

    switch (attr.type) {
      case 'string':
        validator = z.string();
        if (attr.validation?.pattern) {
          validator = (validator as z.ZodString).regex(
            new RegExp(attr.validation.pattern as string)
          );
        }
        if (attr.validation?.minLength) {
          validator = (validator as z.ZodString).min(attr.validation.minLength as number);
        }
        if (attr.validation?.maxLength) {
          validator = (validator as z.ZodString).max(attr.validation.maxLength as number);
        }
        break;

      case 'number':
        validator = z.number();
        if (attr.validation?.min !== undefined) {
          validator = (validator as z.ZodNumber).min(attr.validation.min as number);
        }
        if (attr.validation?.max !== undefined) {
          validator = (validator as z.ZodNumber).max(attr.validation.max as number);
        }
        break;

      case 'boolean':
        validator = z.boolean();
        break;

      case 'date':
        validator = DateSchema;
        break;

      case 'enum':
        if (attr.validation?.values && Array.isArray(attr.validation.values)) {
          validator = z.enum(attr.validation.values as [string, ...string[]]);
        } else {
          validator = z.string();
        }
        break;

      default:
        validator = z.unknown();
    }

    return validator;
  }

  private static ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }
}
```

---

## 7.5 Asset Identity Schema

### 7.5.1 Core Asset Schema

```typescript
// assets/identity.ts
import { z } from 'zod';

/**
 * Universal Asset Identifier
 * Format: lot:<country>-<commodity>-<date>-<sequence>
 *
 * @example "lot:gh-gold-20260115-001"
 * @example "lot:rw-coffee-20260220-042"
 * @example "lot:cd-cobalt-20260310-007"
 */
export const AssetIdSchema = z
  .string()
  .regex(
    /^lot:[a-z]{2}-[a-z]{3,15}-[0-9]{8}-[0-9]{3,6}$/,
    'Invalid asset ID format. Expected: lot:<country>-<commodity>-<date>-<sequence>'
  );

/**
 * Asset Type Schema (validated against registry)
 */
export const AssetTypeSchema = z.string().refine(
  (type) => AssetRegistry.isRegistered(type),
  (type) => ({ message: `Asset type '${type}' is not registered` })
);

/**
 * Verification record attached to an asset
 */
export const VerificationRecordSchema = z.object({
  /** Unique verification ID */
  verificationId: UUIDSchema,

  /** Type of verification performed */
  type: z.enum([
    'origin', // Location/source verification
    'quality', // Quality assessment
    'weight', // Weight measurement
    'purity', // Purity analysis
    'assay', // Laboratory assay
    'esg', // ESG compliance
    'custody', // Chain of custody
    'labor', // Labor compliance (child labor, wages)
    'environmental', // Environmental impact
    'legal', // Legal compliance
  ]),

  /** When verification was performed */
  timestamp: DateTimeSchema,

  /** Who performed the verification */
  verifier: z.object({
    did: GTCXDIDSchema,
    name: z.string(),
    role: z.enum(['inspector', 'validator', 'lab', 'government', 'auditor']),
    certification: z.string().optional(),
  }),

  /** Location where verification occurred */
  location: CoordinatesSchema.optional(),

  /** Verification result */
  result: z.object({
    passed: z.boolean(),
    score: z.number().min(0).max(100).optional(),
    details: z.record(z.string(), z.unknown()),
  }),

  /** Supporting evidence */
  evidence: z
    .array(
      z.object({
        type: z.enum(['photo', 'document', 'measurement', 'certificate', 'signature']),
        reference: z.string(),
        hash: SHA256HashSchema,
        description: z.string().optional(),
      })
    )
    .default([]),

  /** Cryptographic signature */
  signature: SignatureSchema,
});

export type VerificationRecord = z.infer<typeof VerificationRecordSchema>;

/**
 * Complete Asset Identity
 */
export const AssetIdentitySchema = z.object({
  /** Universal asset identifier */
  assetId: AssetIdSchema,

  /** Asset type (from registry) */
  assetType: AssetTypeSchema,

  /** Schema version */
  schemaVersion: SemVerSchema.default('3.0.0'),

  /** Origin information */
  origin: z.object({
    /** Country of origin */
    country: CountryCodeSchema,

    /** Region/state/province */
    region: z.string().optional(),

    /** Specific location */
    coordinates: CoordinatesSchema.optional(),

    /** Source site identifier (mine, farm, etc.) */
    siteId: z.string().optional(),

    /** Extraction/harvest date */
    extractionDate: DateSchema.optional(),
  }),

  /** Dynamic attributes based on asset type */
  attributes: z.record(z.string(), z.unknown()),

  /** Verification chain */
  verifications: z.array(VerificationRecordSchema).default([]),

  /** Current custody state */
  currentCustody: z.object({
    state: z.string(),
    custodian: GTCXDIDSchema,
    location: CoordinatesSchema.optional(),
    since: DateTimeSchema,
  }),

  /** Complete custody chain reference */
  custodyChainId: z.string().optional(),

  /** Merkle root of all verifications */
  verificationsMerkleRoot: SHA256HashSchema.optional(),

  /** Creation metadata */
  created: z.object({
    by: GTCXDIDSchema,
    at: DateTimeSchema,
    txId: z.string(),
  }),

  /** Last update metadata */
  updated: z.object({
    by: GTCXDIDSchema,
    at: DateTimeSchema,
    txId: z.string(),
  }),
});

export type AssetIdentity = z.infer<typeof AssetIdentitySchema>;
```

### 7.5.2 Multi-Commodity Examples

```typescript
// examples/assets.ts

/**
 * Example: Ghanaian Gold Lot
 */
export const goldLotExample: AssetIdentity = {
  assetId: 'lot:gh-gold-20260115-001',
  assetType: 'gold',
  schemaVersion: '3.0.0',

  origin: {
    country: 'GH',
    region: 'Ashanti',
    coordinates: {
      latitude: 6.6885,
      longitude: -1.6244,
      accuracy: 3,
    },
    siteId: 'site:gh-ash-0042',
    extractionDate: '2026-01-15',
  },

  attributes: {
    weightGrams: 1000,
    purityPercentage: 99.5,
    assayMethod: 'fire-assay',
    form: 'dore',
    mercuryFree: true,
  },

  verifications: [
    {
      verificationId: '550e8400-e29b-41d4-a716-446655440001',
      type: 'origin',
      timestamp: '2026-01-15T08:30:00Z',
      verifier: {
        did: 'did:gtcx:va_inspector001',
        name: 'Kwame Asante',
        role: 'inspector',
      },
      location: { latitude: 6.6885, longitude: -1.6244 },
      result: {
        passed: true,
        details: { withinLicenseArea: true, geotagVerified: true },
      },
      evidence: [
        {
          type: 'photo',
          reference: 'ipfs://Qm...',
          hash: 'sha256:abc123...',
          description: 'Site photo with GPS',
        },
      ],
      signature: 'base64signature==',
    },
    {
      verificationId: '550e8400-e29b-41d4-a716-446655440002',
      type: 'weight',
      timestamp: '2026-01-15T09:00:00Z',
      verifier: {
        did: 'did:gtcx:va_scale001',
        name: 'Certified Scale #42',
        role: 'inspector',
        certification: 'PMMC-CAL-2026-0042',
      },
      result: {
        passed: true,
        details: { measuredGrams: 1000.2, tolerance: 0.5 },
      },
      evidence: [],
      signature: 'base64signature==',
    },
    {
      verificationId: '550e8400-e29b-41d4-a716-446655440003',
      type: 'purity',
      timestamp: '2026-01-15T14:00:00Z',
      verifier: {
        did: 'did:gtcx:va_lab001',
        name: 'Ghana Standards Authority Lab',
        role: 'lab',
        certification: 'GSA-LAB-2024-001',
      },
      result: {
        passed: true,
        score: 99.5,
        details: { method: 'fire-assay', goldPct: 99.5, silverPct: 0.3, otherPct: 0.2 },
      },
      evidence: [
        {
          type: 'certificate',
          reference: 'gsa://cert/2026/001234',
          hash: 'sha256:def456...',
          description: 'GSA Assay Certificate',
        },
      ],
      signature: 'base64signature==',
    },
  ],

  currentCustody: {
    state: 'vault',
    custodian: 'did:gtcx:tp_vault_accra_001',
    location: { latitude: 5.56, longitude: -0.1969 },
    since: '2026-01-16T10:00:00Z',
  },

  verificationsMerkleRoot: 'sha256:merkle123...',

  created: {
    by: 'did:gtcx:tp_miner_kofi_001',
    at: '2026-01-15T08:00:00Z',
    txId: 'tx:gh-20260115-00001',
  },

  updated: {
    by: 'did:gtcx:tp_vault_accra_001',
    at: '2026-01-16T10:00:00Z',
    txId: 'tx:gh-20260116-00042',
  },
};

/**
 * Example: Rwandan Coffee Lot
 */
export const coffeeLotExample: AssetIdentity = {
  assetId: 'lot:rw-coffee-20260220-042',
  assetType: 'coffee',
  schemaVersion: '3.0.0',

  origin: {
    country: 'RW',
    region: 'Nyamasheke',
    coordinates: {
      latitude: -2.4667,
      longitude: 29.1333,
      altitude: 1800,
    },
    siteId: 'farm:rw-nya-0087',
    extractionDate: '2026-02-15',
  },

  attributes: {
    weightKg: 500,
    variety: 'arabica',
    processingMethod: 'washed',
    grade: 'A1',
    cuppingScore: 86.5,
    moistureContent: 11.2,
    altitude: 1800,
    harvestYear: 2026,
    certification: 'fairtrade',
  },

  verifications: [
    {
      verificationId: '660e8400-e29b-41d4-a716-446655440001',
      type: 'origin',
      timestamp: '2026-02-15T07:00:00Z',
      verifier: {
        did: 'did:gtcx:va_coop_leader',
        name: 'Uwimana Marie',
        role: 'inspector',
      },
      result: {
        passed: true,
        details: { farmRegistered: true, cooperativeMember: true },
      },
      evidence: [],
      signature: 'base64signature==',
    },
    {
      verificationId: '660e8400-e29b-41d4-a716-446655440002',
      type: 'quality',
      timestamp: '2026-02-20T10:00:00Z',
      verifier: {
        did: 'did:gtcx:va_cupper001',
        name: 'Rwanda Coffee Authority',
        role: 'auditor',
        certification: 'SCA-Q-GRADER',
      },
      result: {
        passed: true,
        score: 86.5,
        details: {
          aroma: 8.5,
          flavor: 8.5,
          aftertaste: 8.0,
          acidity: 8.5,
          body: 8.0,
          balance: 8.5,
          uniformity: 10,
          cleanCup: 10,
          sweetness: 10,
          overall: 8.5,
        },
      },
      evidence: [
        {
          type: 'certificate',
          reference: 'rca://cupping/2026/00042',
          hash: 'sha256:cupping123...',
          description: 'RCA Cupping Report',
        },
      ],
      signature: 'base64signature==',
    },
  ],

  currentCustody: {
    state: 'export_warehouse',
    custodian: 'did:gtcx:tp_exporter_kigali_001',
    location: { latitude: -1.9403, longitude: 29.8739 },
    since: '2026-02-22T14:00:00Z',
  },

  created: {
    by: 'did:gtcx:tp_farmer_marie_001',
    at: '2026-02-15T07:00:00Z',
    txId: 'tx:rw-20260215-00042',
  },

  updated: {
    by: 'did:gtcx:tp_exporter_kigali_001',
    at: '2026-02-22T14:00:00Z',
    txId: 'tx:rw-20260222-00087',
  },
};

/**
 * Example: DRC Cobalt Lot
 */
export const cobaltLotExample: AssetIdentity = {
  assetId: 'lot:cd-cobalt-20260310-007',
  assetType: 'cobalt',
  schemaVersion: '3.0.0',

  origin: {
    country: 'CD',
    region: 'Lualaba',
    coordinates: {
      latitude: -10.7167,
      longitude: 25.4667,
    },
    siteId: 'mine:cd-lua-0023',
    extractionDate: '2026-03-08',
  },

  attributes: {
    weightKg: 2000,
    purityPercentage: 99.3,
    conflictFree: true,
    childLaborFree: true,
    oreType: 'heterogenite',
    esgScore: 78.5,
    rmiCompliant: true,
  },

  verifications: [
    {
      verificationId: '770e8400-e29b-41d4-a716-446655440001',
      type: 'labor',
      timestamp: '2026-03-08T06:00:00Z',
      verifier: {
        did: 'did:gtcx:va_better_mining',
        name: 'Better Mining Auditor',
        role: 'auditor',
        certification: 'RMI-AUDITOR-2025',
      },
      result: {
        passed: true,
        score: 95,
        details: {
          childLaborCheck: true,
          forcedLaborCheck: true,
          safetyCheck: true,
          workersInterviewed: 15,
        },
      },
      evidence: [
        {
          type: 'document',
          reference: 'ipfs://Qm...',
          hash: 'sha256:labor123...',
          description: 'Site inspection report',
        },
      ],
      signature: 'base64signature==',
    },
    {
      verificationId: '770e8400-e29b-41d4-a716-446655440002',
      type: 'esg',
      timestamp: '2026-03-09T10:00:00Z',
      verifier: {
        did: 'did:gtcx:va_esg_auditor',
        name: 'ESG Compliance Services',
        role: 'auditor',
      },
      result: {
        passed: true,
        score: 78.5,
        details: {
          environmental: 72,
          social: 85,
          governance: 78,
          conflictFree: true,
        },
      },
      evidence: [],
      signature: 'base64signature==',
    },
  ],

  currentCustody: {
    state: 'depot',
    custodian: 'did:gtcx:tp_depot_kolwezi_001',
    location: { latitude: -10.7167, longitude: 25.4667 },
    since: '2026-03-10T08:00:00Z',
  },

  created: {
    by: 'did:gtcx:tp_miner_coop_lua_001',
    at: '2026-03-08T06:00:00Z',
    txId: 'tx:cd-20260308-00007',
  },

  updated: {
    by: 'did:gtcx:tp_depot_kolwezi_001',
    at: '2026-03-10T08:00:00Z',
    txId: 'tx:cd-20260310-00015',
  },
};

/**
 * Example: Zambian Timber Lot
 */
export const timberLotExample: AssetIdentity = {
  assetId: 'lot:zm-timber-20260401-012',
  assetType: 'timber',
  schemaVersion: '3.0.0',

  origin: {
    country: 'ZM',
    region: 'Copperbelt',
    coordinates: {
      latitude: -12.8,
      longitude: 28.2,
    },
    siteId: 'concession:zm-cop-0045',
    extractionDate: '2026-03-28',
  },

  attributes: {
    volumeM3: 150,
    species: 'Pterocarpus angolensis', // Mukwa
    legallyHarvested: true,
    grade: 'A',
    moistureContent: 18,
    fscCertified: true,
    pefcCertified: false,
    concessionId: 'ZAFFICO-2024-0045',
  },

  verifications: [
    {
      verificationId: '880e8400-e29b-41d4-a716-446655440001',
      type: 'legal',
      timestamp: '2026-03-25T09:00:00Z',
      verifier: {
        did: 'did:gtcx:va_forestry_dept',
        name: 'Zambia Forestry Department',
        role: 'government',
      },
      result: {
        passed: true,
        details: {
          permitNumber: 'ZAFFICO-HARVEST-2026-0123',
          withinQuota: true,
          speciesAllowed: true,
        },
      },
      evidence: [
        {
          type: 'certificate',
          reference: 'zfd://permit/2026/0123',
          hash: 'sha256:permit123...',
          description: 'Harvest Permit',
        },
      ],
      signature: 'base64signature==',
    },
    {
      verificationId: '880e8400-e29b-41d4-a716-446655440002',
      type: 'environmental',
      timestamp: '2026-03-26T11:00:00Z',
      verifier: {
        did: 'did:gtcx:va_fsc_auditor',
        name: 'FSC Certified Auditor',
        role: 'auditor',
        certification: 'FSC-ACC-001',
      },
      result: {
        passed: true,
        score: 85,
        details: {
          noDeforestation: true,
          biodiversityProtected: true,
          communityConsulted: true,
        },
      },
      evidence: [],
      signature: 'base64signature==',
    },
  ],

  currentCustody: {
    state: 'log_yard',
    custodian: 'did:gtcx:tp_zaffico_yard_001',
    location: { latitude: -12.9, longitude: 28.3 },
    since: '2026-04-01T10:00:00Z',
  },

  created: {
    by: 'did:gtcx:tp_zaffico_ops_001',
    at: '2026-03-28T08:00:00Z',
    txId: 'tx:zm-20260328-00012',
  },

  updated: {
    by: 'did:gtcx:tp_zaffico_yard_001',
    at: '2026-04-01T10:00:00Z',
    txId: 'tx:zm-20260401-00025',
  },
};
```

---

## 7.6 Identity Schemas

### 7.6.1 TradePass DID Document

```typescript
// identity/did.ts
import { z } from 'zod';

/**
 * W3C DID Document for GTCX TradePass
 * @see https://www.w3.org/TR/did-core/
 */
export const TradePassDIDDocumentSchema = z.object({
  /** JSON-LD context */
  '@context': z.tuple([
    z.literal('https://www.w3.org/ns/did/v1'),
    z.literal('https://gtcx.org/contexts/tradepass/v3'),
  ]),

  /** DID identifier */
  id: GTCXDIDSchema,

  /** Controller DIDs */
  controller: z.union([GTCXDIDSchema, z.array(GTCXDIDSchema)]).optional(),

  /** Verification methods (public keys) */
  verificationMethod: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal('Ed25519VerificationKey2020'),
        controller: GTCXDIDSchema,
        publicKeyMultibase: PublicKeyMultibaseSchema,
      })
    )
    .min(1),

  /** Authentication key references */
  authentication: z.array(z.string()),

  /** Assertion method key references */
  assertionMethod: z.array(z.string()),

  /** Key agreement references */
  keyAgreement: z.array(z.string()).optional(),

  /** Service endpoints */
  service: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        serviceEndpoint: z.string().url(),
      })
    )
    .optional(),

  /** GTCX-specific extensions */
  gtcx: z.object({
    /** Schema version */
    version: z.literal('3.0'),

    /** Primary role */
    role: z.enum([
      'producer',
      'rco',
      'aggregator',
      'vault',
      'refiner',
      'buyer',
      'validator',
      'inspector',
      'government',
    ]),

    /** Operating region */
    region: z.string(),

    /** Biometric binding hash */
    biometricHash: SHA256HashSchema,

    /** KYC verification level */
    kycLevel: z.enum(['basic', 'standard', 'enhanced']).default('basic'),

    /** Creation timestamp */
    created: DateTimeSchema,

    /** Last update timestamp */
    updated: DateTimeSchema,
  }),
});

export type TradePassDIDDocument = z.infer<typeof TradePassDIDDocumentSchema>;
```

### 7.6.2 Verifiable Credentials

```typescript
// identity/credentials.ts
import { z } from 'zod';

/**
 * Base Verifiable Credential schema
 * @see https://www.w3.org/TR/vc-data-model/
 */
export const VerifiableCredentialSchema = z.object({
  '@context': z.array(z.string()).min(1),
  type: z.array(z.string()).min(1),
  id: z.string().url(),
  issuer: z.union([z.string(), z.object({ id: z.string() })]),
  issuanceDate: DateTimeSchema,
  expirationDate: DateTimeSchema.optional(),
  credentialSubject: z.record(z.string(), z.unknown()),
  proof: z
    .object({
      type: z.string(),
      created: DateTimeSchema,
      verificationMethod: z.string(),
      proofPurpose: z.string(),
      proofValue: z.string(),
    })
    .optional(),
});

export type VerifiableCredential = z.infer<typeof VerifiableCredentialSchema>;

/**
 * TradePass Role Credential
 */
export const RoleCredentialSchema = VerifiableCredentialSchema.extend({
  type: z.tuple([z.literal('VerifiableCredential'), z.literal('TradePassRoleCredential')]),
  credentialSubject: z.object({
    id: GTCXDIDSchema,
    role: z.enum([
      'producer',
      'rco',
      'aggregator',
      'vault',
      'refiner',
      'buyer',
      'validator',
      'inspector',
      'government',
    ]),
    jurisdiction: CountryCodeSchema,
    issuingAuthority: z.string(),
    licenseNumber: z.string().optional(),
    capabilities: z.array(z.string()),
    constraints: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type RoleCredential = z.infer<typeof RoleCredentialSchema>;

/**
 * TradeCV Milestone Credential
 */
export const TradeCVCredentialSchema = VerifiableCredentialSchema.extend({
  type: z.tuple([z.literal('VerifiableCredential'), z.literal('TradeCVCredential')]),
  credentialSubject: z.object({
    id: GTCXDIDSchema,
    milestone: z.enum([
      'first_sale',
      'quality_verified',
      'premium_access',
      'export_certified',
      'credit_eligible',
      'rco_graduation',
    ]),
    achievedAt: DateTimeSchema,
    evidence: z.object({
      transactionCount: z.number().int().optional(),
      averageGciScore: z.number().optional(),
      totalVolume: z.number().optional(),
      verificationIds: z.array(z.string()).optional(),
    }),
  }),
});

export type TradeCVCredential = z.infer<typeof TradeCVCredentialSchema>;
```

---

## 7.7 Compliance Schemas

### 7.7.1 GCI Score Schema

```typescript
// compliance/scoring.ts
import { z } from 'zod';

/**
 * GCI Input - Data required for score calculation
 */
export const GCIInputSchema = z.object({
  /** Entity being scored */
  entityId: GTCXDIDSchema,

  /** Commodity context */
  commodity: AssetTypeSchema,

  /** Jurisdiction for weight calibration */
  jurisdiction: CountryCodeSchema.optional(),

  /** Factor data */
  factors: z.object({
    environmental: z
      .object({
        mercuryUsage: z.number().min(0).max(100).optional(),
        wasteManagement: z.number().min(0).max(100).optional(),
        waterProtection: z.number().min(0).max(100).optional(),
        landRehabilitation: z.number().min(0).max(100).optional(),
      })
      .optional(),

    safety: z
      .object({
        ppeCompliance: z.number().min(0).max(100).optional(),
        incidentRate: z.number().min(0).optional(),
        trainingCompletion: z.number().min(0).max(100).optional(),
        equipmentMaintenance: z.number().min(0).max(100).optional(),
      })
      .optional(),

    financial: z
      .object({
        recordKeeping: z.number().min(0).max(100).optional(),
        taxCompliance: z.number().min(0).max(100).optional(),
        bankingAccess: z.boolean().optional(),
        transactionHistory: z.number().int().min(0).optional(),
      })
      .optional(),

    social: z
      .object({
        communityBenefit: z.number().min(0).max(100).optional(),
        laborCompliance: z.number().min(0).max(100).optional(),
        childLaborFree: z.boolean().optional(),
        fpicConsent: z.boolean().optional(),
      })
      .optional(),

    regulatory: z
      .object({
        licenseStatus: z.enum(['valid', 'expired', 'pending', 'none']).optional(),
        exportCompliance: z.number().min(0).max(100).optional(),
        inspectionHistory: z.number().min(0).max(100).optional(),
      })
      .optional(),
  }),

  /** Calculation timestamp */
  calculatedAt: DateTimeSchema.optional(),
});

export type GCIInput = z.infer<typeof GCIInputSchema>;

/**
 * GCI Output - Calculated score result
 */
export const GCIOutputSchema = z.object({
  /** Score identifier */
  scoreId: UUIDSchema,

  /** Entity scored */
  entityId: GTCXDIDSchema,

  /** Overall score (0-100) */
  overall: z.number().min(0).max(100),

  /** Category breakdown */
  breakdown: z.object({
    environmental: z.number().min(0).max(100),
    safety: z.number().min(0).max(100),
    financial: z.number().min(0).max(100),
    social: z.number().min(0).max(100),
    regulatory: z.number().min(0).max(100),
  }),

  /** Score category */
  category: z.enum(['PREMIUM', 'VERIFIED', 'PROVISIONAL', 'UNREGISTERED']),

  /** Trend indicator */
  trend: z.enum(['improving', 'stable', 'declining']),

  /** Improvement recommendations */
  recommendations: z.array(
    z.object({
      factor: z.string(),
      currentScore: z.number(),
      targetScore: z.number(),
      action: z.string(),
      impact: z.enum(['low', 'medium', 'high']),
    })
  ),

  /** Calculation metadata */
  calculatedAt: DateTimeSchema,
  validUntil: DateTimeSchema,

  /** Data completeness */
  dataCompleteness: z.number().min(0).max(1),

  /** Cryptographic signature */
  signature: SignatureSchema,
});

export type GCIOutput = z.infer<typeof GCIOutputSchema>;
```

---

## 7.8 Settlement Schemas

### 7.8.1 Escrow Schema

```typescript
// settlement/escrow.ts
import { z } from 'zod';

/**
 * Payment Method
 */
export const PaymentMethodSchema = z.enum([
  'mtn_momo',
  'vodafone_cash',
  'airtel_money',
  'mpesa',
  'orange_money',
  'bank_transfer',
  'usdc',
  'usdt',
]);

/**
 * Escrow State
 */
export const EscrowStateSchema = z.enum([
  'created',
  'funded',
  'validating',
  'custody_transferred',
  'settled',
  'disputed',
  'cancelled',
  'expired',
]);

/**
 * Escrow Release Condition
 */
export const ReleaseConditionSchema = z.object({
  type: z.enum([
    'gci_threshold',
    'custody_verified',
    'panx_consensus',
    'time_elapsed',
    'manual_approval',
  ]),

  parameters: z.record(z.string(), z.unknown()),

  satisfied: z.boolean().default(false),
  satisfiedAt: DateTimeSchema.optional(),
});

/**
 * Complete Escrow Schema
 */
export const EscrowSchema = z.object({
  /** Escrow identifier */
  escrowId: UUIDSchema,

  /** Schema version */
  schemaVersion: SemVerSchema.default('3.0.0'),

  /** Buyer information */
  buyer: z.object({
    did: GTCXDIDSchema,
    name: z.string(),
    verified: z.boolean(),
  }),

  /** Seller information */
  seller: z.object({
    did: GTCXDIDSchema,
    name: z.string(),
    gciScore: z.number().min(0).max(100),
  }),

  /** Asset being traded */
  asset: z.object({
    assetId: AssetIdSchema,
    assetType: AssetTypeSchema,
    quantity: z.number().positive(),
    unit: z.string(),
    description: z.string().optional(),
  }),

  /** Payment details */
  payment: z.object({
    amount: MoneySchema,
    method: PaymentMethodSchema,
    reference: z.string().optional(),
    fundedAt: DateTimeSchema.optional(),
  }),

  /** Release conditions */
  conditions: z.object({
    minGciScore: z.number().min(0).max(100).default(50),
    requiredVerifications: z.array(z.string()).default(['custody']),
    panxThreshold: z.number().min(0).max(1).default(0.67),
    expiresAt: DateTimeSchema,
    customConditions: z.array(ReleaseConditionSchema).default([]),
  }),

  /** Current state */
  state: EscrowStateSchema,

  /** Timeline of events */
  timeline: z.array(
    z.object({
      event: z.string(),
      timestamp: DateTimeSchema,
      actor: GTCXDIDSchema,
      details: z.record(z.string(), z.unknown()).optional(),
    })
  ),

  /** Multi-signature requirements */
  signatures: z.object({
    buyer: SignatureSchema.optional(),
    seller: SignatureSchema.optional(),
    validator: SignatureSchema.optional(),
  }),

  /** Dispute reference (if any) */
  disputeId: UUIDSchema.optional(),

  /** Creation/update timestamps */
  created: DateTimeSchema,
  updated: DateTimeSchema,
});

export type Escrow = z.infer<typeof EscrowSchema>;
```

---

## 7.9 Schema Versioning

### 7.9.1 Version Registry

```typescript
// migrations/registry.ts
import { z } from 'zod';

/**
 * Schema version status
 */
export const VersionStatusSchema = z.enum([
  'current', // Active, recommended version
  'supported', // Still supported, but not recommended
  'deprecated', // Supported with sunset date
  'unsupported', // No longer supported
]);

/**
 * Schema version entry
 */
export const SchemaVersionEntrySchema = z.object({
  version: SemVerSchema,
  status: VersionStatusSchema,
  releasedAt: DateTimeSchema,
  sunsetAt: DateTimeSchema.optional(),
  changelog: z.string().optional(),
});

/**
 * Complete schema version registry
 */
export const SchemaVersionRegistrySchema = z.record(
  z.string(), // Schema name
  z.object({
    currentVersion: SemVerSchema,
    versions: z.array(SchemaVersionEntrySchema),
  })
);

export type SchemaVersionRegistry = z.infer<typeof SchemaVersionRegistrySchema>;

/**
 * Default version registry
 */
export const DefaultSchemaVersionRegistry: SchemaVersionRegistry = {
  AssetIdentity: {
    currentVersion: '3.0.0',
    versions: [
      { version: '1.0.0', status: 'unsupported', releasedAt: '2024-01-01T00:00:00Z' },
      {
        version: '2.0.0',
        status: 'deprecated',
        releasedAt: '2025-01-01T00:00:00Z',
        sunsetAt: '2027-06-01T00:00:00Z',
      },
      {
        version: '2.1.0',
        status: 'deprecated',
        releasedAt: '2025-06-01T00:00:00Z',
        sunsetAt: '2027-12-01T00:00:00Z',
      },
      { version: '3.0.0', status: 'current', releasedAt: '2026-01-15T00:00:00Z' },
    ],
  },

  TradePassDIDDocument: {
    currentVersion: '3.0.0',
    versions: [
      {
        version: '2.0.0',
        status: 'deprecated',
        releasedAt: '2025-01-01T00:00:00Z',
        sunsetAt: '2027-06-01T00:00:00Z',
      },
      { version: '3.0.0', status: 'current', releasedAt: '2026-01-15T00:00:00Z' },
    ],
  },

  GCIOutput: {
    currentVersion: '3.0.0',
    versions: [
      {
        version: '2.0.0',
        status: 'deprecated',
        releasedAt: '2025-01-01T00:00:00Z',
        sunsetAt: '2027-06-01T00:00:00Z',
      },
      { version: '3.0.0', status: 'current', releasedAt: '2026-01-15T00:00:00Z' },
    ],
  },

  GeoTagCredential: {
    currentVersion: '3.0.0',
    versions: [
      {
        version: '2.0.0',
        status: 'deprecated',
        releasedAt: '2025-01-01T00:00:00Z',
        sunsetAt: '2027-06-01T00:00:00Z',
      },
      { version: '3.0.0', status: 'current', releasedAt: '2026-01-15T00:00:00Z' },
    ],
  },

  Escrow: {
    currentVersion: '3.0.0',
    versions: [
      {
        version: '2.0.0',
        status: 'deprecated',
        releasedAt: '2025-01-01T00:00:00Z',
        sunsetAt: '2027-06-01T00:00:00Z',
      },
      { version: '3.0.0', status: 'current', releasedAt: '2026-01-15T00:00:00Z' },
    ],
  },
};
```

### 7.9.2 Migration Interface

```typescript
// migrations/interface.ts

/**
 * Migration function signature
 */
export interface Migration<TFrom = unknown, TTo = unknown> {
  /** Source version */
  fromVersion: string;

  /** Target version */
  toVersion: string;

  /** Upgrade function */
  up(data: TFrom): TTo;

  /** Downgrade function (optional) */
  down?(data: TTo): TFrom;

  /** Validate input data */
  validate(data: unknown): data is TFrom;
}

/**
 * Migration result
 */
export interface MigrationResult<T> {
  success: boolean;
  data?: T;
  sourceVersion: string;
  targetVersion: string;
  migrationsApplied: string[];
  errors?: string[];
  warnings?: string[];
}

/**
 * Migration registry
 */
export interface MigrationRegistry {
  /** Get migration for a specific version transition */
  getMigration(schema: string, from: string, to: string): Migration | undefined;

  /** Get migration path from one version to another */
  getMigrationPath(schema: string, from: string, to: string): Migration[];

  /** Register a new migration */
  register(schema: string, migration: Migration): void;
}
```

---

## 7.10 Validation Utilities

### 7.10.1 Schema Validator

```typescript
// validation/validator.ts
import { z } from 'zod';

/**
 * Validation result
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string[];
  message: string;
  code: string;
}

/**
 * Schema validator with detailed error reporting
 */
export class SchemaValidator {
  /**
   * Validate data against a schema
   */
  static validate<T extends z.ZodTypeAny>(schema: T, data: unknown): ValidationResult<z.infer<T>> {
    const result = schema.safeParse(data);

    if (result.success) {
      return { success: true, data: result.data };
    }

    const errors: ValidationError[] = result.error.issues.map((issue) => ({
      path: issue.path.map((p) => String(p)),
      message: issue.message,
      code: issue.code,
    }));

    return { success: false, errors };
  }

  /**
   * Validate with automatic version detection and migration
   */
  static validateWithMigration<T>(
    schemaName: string,
    data: unknown,
    targetSchema: z.ZodType<T>,
    migrationRegistry: MigrationRegistry
  ): ValidationResult<T> {
    // Detect version
    const detectedVersion = this.detectVersion(data);
    const targetVersion = this.getSchemaVersion(schemaName);

    // If versions match, validate directly
    if (detectedVersion === targetVersion) {
      return this.validate(targetSchema, data);
    }

    // Get migration path
    const migrations = migrationRegistry.getMigrationPath(
      schemaName,
      detectedVersion,
      targetVersion
    );

    if (migrations.length === 0) {
      return {
        success: false,
        errors: [
          {
            path: [],
            message: `No migration path from ${detectedVersion} to ${targetVersion}`,
            code: 'migration_not_found',
          },
        ],
      };
    }

    // Apply migrations
    let currentData = data;
    for (const migration of migrations) {
      if (!migration.validate(currentData)) {
        return {
          success: false,
          errors: [
            {
              path: [],
              message: `Migration validation failed at ${migration.fromVersion}`,
              code: 'migration_validation_failed',
            },
          ],
        };
      }
      currentData = migration.up(currentData);
    }

    // Validate final result
    return this.validate(targetSchema, currentData);
  }

  private static detectVersion(data: unknown): string {
    if (typeof data !== 'object' || data === null) {
      return '1.0.0';
    }

    // Check for explicit version field
    if ('schemaVersion' in data && typeof (data as any).schemaVersion === 'string') {
      return (data as any).schemaVersion;
    }

    // Check for gtcx.version
    if ('gtcx' in data && typeof (data as any).gtcx?.version === 'string') {
      return (data as any).gtcx.version + '.0';
    }

    return '2.0.0'; // Default to previous version
  }

  private static getSchemaVersion(schemaName: string): string {
    return DefaultSchemaVersionRegistry[schemaName]?.currentVersion ?? '3.0.0';
  }
}
```

---

## 7.11 Type Exports

### 7.11.1 Public API

```typescript
// index.ts

// === Core Primitives ===
export {
  GTCXDIDSchema,
  DIDTypeSchema,
  UUIDSchema,
  DateTimeSchema,
  DateSchema,
  CountryCodeSchema,
  CurrencyCodeSchema,
  SemVerSchema,
  SignatureSchema,
  SHA256HashSchema,
  PublicKeyMultibaseSchema,
} from './core/primitives';

export type { DIDType } from './core/primitives';

// === Common Types ===
export {
  CoordinatesSchema,
  GeohashSchema,
  MoneySchema,
  WeightSchema,
  AddressSchema,
  ContactSchema,
  PaginationSchema,
  PaginatedResponseSchema,
} from './core/common';

export type { Coordinates, Money, Weight, Address, Contact, Pagination } from './core/common';

// === Asset Schemas ===
export {
  AssetIdSchema,
  AssetTypeSchema,
  AssetTypeConfigSchema,
  AssetIdentitySchema,
  VerificationRecordSchema,
  AssetRegistry,
} from './assets';

export type { AssetTypeConfig, AssetIdentity, VerificationRecord } from './assets';

// === Commodity Configs ===
export { GoldConfig } from './config/commodities/gold';
export { CoffeeConfig } from './config/commodities/coffee';
export { CobaltConfig } from './config/commodities/cobalt';
export { TimberConfig } from './config/commodities/timber';

// === Identity Schemas ===
export {
  TradePassDIDDocumentSchema,
  VerifiableCredentialSchema,
  RoleCredentialSchema,
  TradeCVCredentialSchema,
} from './identity';

export type {
  TradePassDIDDocument,
  VerifiableCredential,
  RoleCredential,
  TradeCVCredential,
} from './identity';

// === Compliance Schemas ===
export { GCIInputSchema, GCIOutputSchema } from './compliance';

export type { GCIInput, GCIOutput } from './compliance';

// === Settlement Schemas ===
export {
  PaymentMethodSchema,
  EscrowStateSchema,
  ReleaseConditionSchema,
  EscrowSchema,
} from './settlement';

export type { Escrow } from './settlement';

// === Versioning ===
export { SchemaVersionRegistrySchema, DefaultSchemaVersionRegistry } from './migrations/registry';

export type {
  SchemaVersionRegistry,
  Migration,
  MigrationResult,
  MigrationRegistry,
} from './migrations';

// === Validation ===
export { SchemaValidator } from './validation/validator';

export type { ValidationResult, ValidationError } from './validation/validator';
```

---

## 7.12 Performance Considerations

### 7.12.1 Schema Compilation

```typescript
// performance/compilation.ts

/**
 * Pre-compile frequently used schemas for better performance
 */
export const CompiledSchemas = {
  AssetIdentity: AssetIdentitySchema,
  TradePassDID: TradePassDIDDocumentSchema,
  GCIOutput: GCIOutputSchema,
  Escrow: EscrowSchema,
} as const;

// Schemas are compiled at import time
// Reuse these instances rather than creating new schemas
```

### 7.12.2 Validation Performance Targets

| Schema                 | Target Parse Time | Max Size |
| ---------------------- | ----------------- | -------- |
| `AssetIdentity`        | <5ms              | 100KB    |
| `TradePassDIDDocument` | <2ms              | 50KB     |
| `GCIOutput`            | <2ms              | 20KB     |
| `Escrow`               | <3ms              | 50KB     |
| `VerificationRecord`   | <1ms              | 10KB     |

---

## 7.13 Integration Points

### 7.13.1 Inputs

| Source         | Data               | Schema                               |
| -------------- | ------------------ | ------------------------------------ |
| **TradePass™** | Identity documents | `TradePassDIDDocumentSchema`         |
| **GCI™**       | Score calculations | `GCIInputSchema`, `GCIOutputSchema`  |
| **GeoTag™**    | Location captures  | `CoordinatesSchema`, `GeohashSchema` |
| **VaultMark™** | Asset records      | `AssetIdentitySchema`                |
| **PvP™**       | Settlement records | `EscrowSchema`                       |

### 7.13.2 Outputs

| Destination       | Data              | Purpose             |
| ----------------- | ----------------- | ------------------- |
| **All Services**  | Validated types   | Type-safe runtime   |
| **Storage**       | Versioned schemas | Data evolution      |
| **API Layer**     | Type definitions  | Contract stability  |
| **Documentation** | Type exports      | Developer reference |

---

_End of Section 7_
