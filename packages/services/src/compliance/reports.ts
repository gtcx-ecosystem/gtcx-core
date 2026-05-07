import type { ComplianceRecord, ComplianceCategory } from './types';

export function generateReportBreakdown(records: ComplianceRecord[]): Record<string, unknown> {
  return {
    byStatus: {
      compliant: records.filter((r) => r.status === 'compliant').length,
      warning: records.filter((r) => r.status === 'warning').length,
      violation: records.filter((r) => r.status === 'violation').length,
      pending: records.filter((r) => r.status === 'pending_review').length,
    },
    bySeverity: {
      critical: records.filter((r) => r.severity === 'critical').length,
      high: records.filter((r) => r.severity === 'high').length,
      medium: records.filter((r) => r.severity === 'medium').length,
      low: records.filter((r) => r.severity === 'low').length,
    },
  };
}

export async function generateRecommendations(records: ComplianceRecord[]): Promise<string[]> {
  const recommendations: string[] = [];
  const critical = records.filter((r) => r.severity === 'critical').length;
  const licenseViolations = records.filter(
    (r) => r.regulation.category === 'licensing' && r.status === 'violation'
  ).length;

  if (critical > 0) {
    recommendations.push(`Prioritize resolution of ${critical} critical violations`);
  }
  if (licenseViolations > 0) {
    recommendations.push('Address licensing violations to maintain operational status');
  }
  recommendations.push('Implement automated compliance monitoring');
  recommendations.push('Establish regular compliance review schedule');
  return recommendations;
}

export async function generateActionItems(records: ComplianceRecord[]): Promise<unknown[]> {
  return records
    .filter((r) => r.status === 'violation' || r.status === 'warning')
    .map((r) => ({
      id: r.id,
      description: r.finding.description,
      severity: r.severity,
      dueDate: r.resolution?.dueDate,
      assignedTo: r.resolution?.assignedTo,
    }));
}

export async function calculateComplianceTrend(
  records: ComplianceRecord[]
): Promise<'improving' | 'declining' | 'stable'> {
  if (records.length < 2) return 'stable';

  const sorted = [...records].sort(
    (a, b) => new Date(a.metadata.createdAt).getTime() - new Date(b.metadata.createdAt).getTime()
  );
  const mid = Math.floor(sorted.length / 2);
  const olderHalf = sorted.slice(0, mid);
  const newerHalf = sorted.slice(mid);

  const complianceRate = (recs: ComplianceRecord[]) => {
    if (recs.length === 0) return 0;
    return recs.filter((r) => r.status === 'compliant').length / recs.length;
  };

  const olderRate = complianceRate(olderHalf);
  const newerRate = complianceRate(newerHalf);
  const delta = newerRate - olderRate;

  if (delta > 0.05) return 'improving';
  if (delta < -0.05) return 'declining';
  return 'stable';
}

export async function getComplianceByCategory(
  records: ComplianceRecord[]
): Promise<
  Record<
    string,
    { total: number; compliant: number; violations: number; trend: 'up' | 'down' | 'stable' }
  >
> {
  const categories: ComplianceCategory[] = [
    'licensing',
    'environmental',
    'financial',
    'operational',
  ];
  const result: Record<
    string,
    { total: number; compliant: number; violations: number; trend: 'up' | 'down' | 'stable' }
  > = {};

  for (const category of categories) {
    const catRecords = records.filter((r) => r.regulation.category === category);
    result[category] = {
      total: catRecords.length,
      compliant: catRecords.filter((r) => r.status === 'compliant').length,
      violations: catRecords.filter((r) => r.status === 'violation').length,
      trend: 'stable',
    };
  }
  return result;
}

export async function getUrgentActions(records: ComplianceRecord[]): Promise<ComplianceRecord[]> {
  return records
    .filter((r) => r.severity === 'critical' || r.severity === 'high')
    .sort((a, b) => b.metadata.priority - a.metadata.priority)
    .slice(0, 10);
}

export async function getRecentActivity(records: ComplianceRecord[]): Promise<ComplianceRecord[]> {
  return records
    .sort(
      (a, b) => new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime()
    )
    .slice(0, 20);
}

export async function getUpcomingDeadlines(
  records: ComplianceRecord[]
): Promise<{ record: ComplianceRecord; daysRemaining: number }[]> {
  return records
    .filter((r) => r.resolution?.dueDate)
    .map((r) => ({
      record: r,
      daysRemaining: Math.ceil(
        (new Date(r.resolution!.dueDate!).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
      ),
    }))
    .filter((item) => item.daysRemaining > 0 && item.daysRemaining <= 30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}
