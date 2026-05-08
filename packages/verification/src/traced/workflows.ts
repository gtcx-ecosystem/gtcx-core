/**
 * Workflow tracing for verification operations.
 */

import { withTrace, createCategoryLogger } from '../tracing.js';

const verificationLog = createCategoryLogger('verification');

export async function tracedVerificationWorkflow<T>(
  workflow: () => Promise<T>,
  workflowName: string,
  metadata?: Record<string, unknown>
): Promise<T> {
  verificationLog.info('workflow.start', { name: workflowName, ...metadata });

  try {
    const result = await withTrace(workflow);
    verificationLog.info('workflow.complete', { name: workflowName });
    return result;
  } catch (error) {
    verificationLog.error('workflow.failed', {
      error: error instanceof Error ? error.message : String(error),
      name: workflowName,
    });
    throw error;
  }
}
