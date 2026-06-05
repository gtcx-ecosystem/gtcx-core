export { UnifiedComplianceService } from './UnifiedComplianceService';

// ============================================================================
// RE-EXPORTS
// ============================================================================

export * from './types';
export { getDefaultFrameworks } from './frameworks';
export {
  createComplianceRecord,
  generateRecordId,
  generateCorrelationId,
  calculatePriority,
  buildComplianceResult,
} from './helpers';
export {
  extractZkProof,
  checkDocumentation,
  checkProducerLicense,
  checkTraderLicense,
  checkLocationCompliance,
  checkKYCCompliance,
  verifyZkProofIfPresent,
} from './validators';
export {
  generateReportBreakdown,
  generateRecommendations,
  generateActionItems,
  calculateComplianceTrend,
  getComplianceByCategory,
  getUrgentActions,
  getRecentActivity,
  getUpcomingDeadlines,
} from './reports';
export { getFilteredComplianceRecords } from './data-access';
