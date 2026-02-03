// ============================================================================
// SITE MODEL
// Mining and collection sites
// ============================================================================

export interface Site {
  id: string;
  name: string;
  type: SiteType;
  location: SiteLocation;
  operator: SiteOperator;
  permits: string[];
  compliance: SiteCompliance;
  production?: ProductionStats;
  status: SiteStatus;
  metadata: SiteMetadata;
  createdAt: number;
  updatedAt: number;
}

export type SiteType =
  | 'artisanal_mine'
  | 'small_scale_mine'
  | 'large_scale_mine'
  | 'collection_point'
  | 'buying_center'
  | 'processing_facility'
  | 'refinery'
  | 'vault'
  | 'port';

export interface SiteLocation {
  country: string;
  region: string;
  district?: string;
  locality?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  boundary?: GeoPolygon;
  elevation?: number;
  accessNotes?: string;
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface SiteOperator {
  tradePassId: string;
  name: string;
  type: 'individual' | 'cooperative' | 'company';
  organizationId?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export interface SiteCompliance {
  gciScore: number;
  tier: string;
  lastAssessment?: number;
  nextAssessment?: number;
  issues: SiteIssue[];
  certifications: string[];
}

export interface SiteIssue {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedAt: number;
  resolvedAt?: number;
  resolution?: string;
}

export interface ProductionStats {
  totalProduction: number;
  unit: string;
  period: {
    start: number;
    end: number;
  };
  averageDaily?: number;
  lastUpdated: number;
}

export type SiteStatus =
  | 'pending_registration'
  | 'registered'
  | 'active'
  | 'suspended'
  | 'inactive'
  | 'closed';

export interface SiteMetadata {
  geologicalInfo?: GeologicalInfo;
  infrastructure?: InfrastructureInfo;
  workforce?: WorkforceInfo;
  environmental?: EnvironmentalInfo;
}

export interface GeologicalInfo {
  formation?: string;
  mineralogy?: string[];
  goldPotential?: 'high' | 'medium' | 'low';
  estimatedReserves?: number;
  reservesUnit?: string;
}

export interface InfrastructureInfo {
  hasRoadAccess: boolean;
  hasElectricity: boolean;
  hasWater: boolean;
  hasCommunications: boolean;
  equipment?: string[];
  facilities?: string[];
}

export interface WorkforceInfo {
  totalWorkers: number;
  categories?: Record<string, number>;
  safetyTraining: boolean;
  lastTrainingDate?: number;
}

export interface EnvironmentalInfo {
  impactAssessment?: string;
  mitigationPlan?: string;
  monitoringSchedule?: string;
  lastInspection?: number;
}
