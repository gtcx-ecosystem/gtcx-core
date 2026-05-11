// ============================================================================
// COMMODITY CONFIG SCHEMA
// ============================================================================

import { z } from 'zod';

import {
  AssetCategorySchema,
  CommodityTypeSchema,
  MeasurementUnitSchema,
  OperatorRoleSchema,
  QualityGradeSchema,
  SiteTypeSchema,
} from './enums';

export const CommodityConfigSchema = z.object({
  type: CommodityTypeSchema,
  category: AssetCategorySchema,
  displayName: z.string(),
  defaultUnit: MeasurementUnitSchema,
  allowedUnits: z.array(MeasurementUnitSchema),
  hasPurity: z.boolean(),
  qualityGrades: z.array(QualityGradeSchema),
  primaryProducerRole: OperatorRoleSchema,
  primarySiteType: SiteTypeSchema,
  settings: z.record(z.unknown()).optional(),
});
