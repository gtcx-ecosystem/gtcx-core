import type { ComplianceRecord, ValidatedComplianceReportOptions } from './types';

export async function getFilteredComplianceRecords(
  options: ValidatedComplianceReportOptions,
  getAllRecords: () => Promise<ComplianceRecord[]>
): Promise<ComplianceRecord[]> {
  const allRecords = await getAllRecords();
  return allRecords.filter((record) => {
    const recordDate = new Date(record.metadata.createdAt);
    const startDate = new Date(options.dateRange.start);
    const endDate = new Date(options.dateRange.end);

    if (recordDate < startDate || recordDate > endDate) return false;
    if (options.apps && !options.apps.includes(record.sourceApp)) return false;
    if (options.categories && !options.categories.includes(record.regulation.category))
      return false;
    if (options.severity && !options.severity.includes(record.severity)) return false;
    return true;
  });
}
