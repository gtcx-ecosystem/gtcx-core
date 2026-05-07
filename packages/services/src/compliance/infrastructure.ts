// ---------------------------------------------------------------------------
// SERVICE METRICS & EVENT FACTORY (lightweight local implementations)
// ---------------------------------------------------------------------------

import type { IDomainEventEmitter, IMetricsCollector, IOperationLogger } from './types';

export class ServiceMetrics {
  constructor(
    private collector: IMetricsCollector | null,
    private service: string
  ) {}
  counter(name: string, value: number, labels?: Record<string, string>) {
    this.collector?.counter(`${this.service}.${name}`, value, labels);
  }
  histogram(name: string, value: number, labels?: Record<string, string>) {
    this.collector?.histogram(`${this.service}.${name}`, value, labels);
  }
}

export class DomainEventFactory {
  compliance(type: string, payload: unknown, correlationId?: string): unknown {
    return { type, payload, correlationId, timestamp: new Date().toISOString() };
  }
}

export const nullEventEmitter: IDomainEventEmitter = { emit: () => {} };
export const nullMetricsCollector: IMetricsCollector = {
  counter: () => {},
  histogram: () => {},
};
export const nullOperationLogger: IOperationLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
};
