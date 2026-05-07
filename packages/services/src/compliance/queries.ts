import type { ComplianceRecord, IComplianceRepository } from './types';

export async function getAllComplianceRecords(
  repo: IComplianceRepository | undefined
): Promise<ComplianceRecord[]> {
  if (repo) return repo.getRecords();
  return [];
}
