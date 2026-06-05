import {
  calculateComplianceTrend,
  getComplianceByCategory,
  getRecentActivity,
  getUrgentActions,
  getUpcomingDeadlines,
} from './reports';
import type { ComplianceDashboard, ComplianceRecord } from './types';

export async function buildDashboard(allRecords: ComplianceRecord[]): Promise<ComplianceDashboard> {
  const compliant = allRecords.filter((r) => r.status === 'compliant');
  const critical = allRecords.filter((r) => r.severity === 'critical');
  const pending = allRecords.filter(
    (r) => r.status === 'pending_review' || r.resolution?.status === 'pending'
  );
  const score = allRecords.length > 0 ? (compliant.length / allRecords.length) * 100 : 100;

  return {
    overview: {
      totalRecords: allRecords.length,
      compliantPercentage: Math.round(score),
      pendingIssues: pending.length,
      criticalViolations: critical.length,
      complianceScore: Math.round(score),
      trendDirection: await calculateComplianceTrend(allRecords),
    },
    byCategory: await getComplianceByCategory(allRecords),
    urgentActions: await getUrgentActions(allRecords),
    recentActivity: await getRecentActivity(allRecords),
    upcomingDeadlines: await getUpcomingDeadlines(allRecords),
  };
}
