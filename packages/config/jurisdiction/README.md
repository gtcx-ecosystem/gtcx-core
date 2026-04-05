# @gtcx/jurisdiction-config

Multi-sovereign jurisdiction configuration schemas for the GTCX ecosystem. Defines the shape of per-jurisdiction deployment config covering identity, regulatory, commodity, financial, telecom, hardware, and compliance settings.

## Installation

```bash
pnpm add @gtcx/jurisdiction-config
```

## Usage

```typescript
import {
  loadJurisdictionConfig,
  validateJurisdictionConfig,
  JurisdictionConfigSchema,
} from '@gtcx/jurisdiction-config';

// Validate and load a jurisdiction config object
const result = loadJurisdictionConfig({
  identity: { kycRequired: true, minimumAge: 18 },
  regulatory: { miningLicenseRequired: true },
  commodities: [{ type: 'gold', unit: 'gram', minPurity: 0.995 }],
  deployment: { region: 'gh', currency: 'GHS' },
  // ... other sections
});

if (result.success) {
  console.log(result.config.deployment.region);
} else {
  console.error(result.errors);
}

// Type guard
if (validateJurisdictionConfig(raw)) {
  // raw is now typed as JurisdictionConfig
}
```

## Schema Sections

| Schema                       | Description                               |
| ---------------------------- | ----------------------------------------- |
| `IdentitySchema`             | KYC requirements, age limits              |
| `RegulatorySchema`           | License and permit requirements           |
| `CommoditySchema`            | Commodity types, units, purity thresholds |
| `LocalizationSchema`         | Language, date/number formats             |
| `FinancialSchema`            | Currency, payment methods, limits         |
| `TelecomSchema`              | Mobile money, USSD config                 |
| `IdentityVerificationSchema` | Document types, biometric requirements    |
| `HardwareSchema`             | Device certification, sensor requirements |
| `GeoTagSchema`               | GPS accuracy, geofencing                  |
| `CustodySchema`              | Chain of custody rules                    |
| `SupportSchema`              | Support channels, SLA                     |
| `GciSchema`                  | GCI scoring parameters                    |
| `DeploymentSchema`           | Region, currency, feature flags           |

## Dependencies

- `zod` — runtime schema validation

## License

MIT
