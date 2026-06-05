/**
 * Metrics Collection
 *
 * Performance and business metrics for domain services.
 * Completes P12 (Observability) principle.
 *
 */

// ============================================================================
// METRIC TYPES
// ============================================================================

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';

export interface Metric {
  name: string;
  type: MetricType;
  help: string;
  labels?: Record<string, string> | undefined;
  value: number;
  timestamp: number;
}

export interface HistogramBucket {
  le: number; // Less than or equal
  count: number;
}

export interface HistogramMetric extends Metric {
  type: 'histogram';
  buckets: HistogramBucket[];
  sum: number;
  count: number;
}

export interface SummaryQuantile {
  quantile: number;
  value: number;
}

export interface SummaryMetric extends Metric {
  type: 'summary';
  quantiles: SummaryQuantile[];
  sum: number;
  count: number;
}

// ============================================================================
// METRIC DEFINITIONS
// ============================================================================

export const METRIC_NAMES = {
  // Registration metrics
  REGISTRATION_TOTAL: 'gtcx_registration_total',
  REGISTRATION_DURATION: 'gtcx_registration_duration_ms',
  REGISTRATION_ERRORS: 'gtcx_registration_errors_total',
  REGISTRATION_PHOTOS: 'gtcx_registration_photos_count',

  // Trading metrics
  TRADE_TOTAL: 'gtcx_trade_total',
  TRADE_VOLUME: 'gtcx_trade_volume',
  TRADE_VALUE: 'gtcx_trade_value',
  TRADE_DURATION: 'gtcx_trade_duration_ms',
  TRADE_ERRORS: 'gtcx_trade_errors_total',
  PRICE_CALCULATION_DURATION: 'gtcx_price_calculation_duration_ms',

  // Compliance metrics
  COMPLIANCE_CHECK_TOTAL: 'gtcx_compliance_check_total',
  COMPLIANCE_CHECK_DURATION: 'gtcx_compliance_check_duration_ms',
  COMPLIANCE_VIOLATIONS: 'gtcx_compliance_violations_total',
  COMPLIANCE_WARNINGS: 'gtcx_compliance_warnings_total',
  COMPLIANCE_SCORE: 'gtcx_compliance_score',

  // Queue metrics
  QUEUE_SIZE: 'gtcx_queue_size',
  QUEUE_PROCESSING_DURATION: 'gtcx_queue_processing_duration_ms',
  QUEUE_ERRORS: 'gtcx_queue_errors_total',
  QUEUE_CONFLICTS: 'gtcx_queue_conflicts_total',

  // Validation metrics
  VALIDATION_DURATION: 'gtcx_validation_duration_ms',
  VALIDATION_ERRORS: 'gtcx_validation_errors_total',
} as const;

// ============================================================================
// METRICS COLLECTOR INTERFACE
// ============================================================================

export interface IMetricsCollector {
  /** Increment a counter */
  increment(name: string, labels?: Record<string, string>, value?: number): void;

  /** Set a gauge value */
  gauge(name: string, value: number, labels?: Record<string, string>): void;

  /** Record a histogram observation */
  histogram(name: string, value: number, labels?: Record<string, string>): void;

  /** Record a summary observation */
  summary(name: string, value: number, labels?: Record<string, string>): void;

  /** Get all metrics */
  getMetrics(): Metric[];

  /** Get metrics in Prometheus format */
  toPrometheus(): string;

  /** Reset all metrics */
  reset(): void;
}

// ============================================================================
// IN-MEMORY METRICS COLLECTOR
// ============================================================================

export class InMemoryMetricsCollector implements IMetricsCollector {
  private counters: Map<string, { value: number; labels?: Record<string, string> | undefined }> =
    new Map();
  private gauges: Map<string, { value: number; labels?: Record<string, string> | undefined }> =
    new Map();
  private histograms: Map<
    string,
    { values: number[]; labels?: Record<string, string> | undefined }
  > = new Map();
  private summaries: Map<
    string,
    { values: number[]; labels?: Record<string, string> | undefined }
  > = new Map();

  private defaultBuckets = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
  private defaultQuantiles = [0.5, 0.9, 0.95, 0.99];
  private maxObservations: number;

  constructor(options?: { maxObservations?: number }) {
    this.maxObservations = options?.maxObservations ?? 10000;
  }

  increment(name: string, labels?: Record<string, string>, value = 1): void {
    const key = this.makeKey(name, labels);
    const current = this.counters.get(key);
    this.counters.set(key, {
      value: (current?.value || 0) + value,
      labels,
    });
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.makeKey(name, labels);
    this.gauges.set(key, { value, labels });
  }

  histogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.makeKey(name, labels);
    const current = this.histograms.get(key);
    if (current) {
      if (current.values.length >= this.maxObservations) {
        current.values.shift();
      }
      current.values.push(value);
    } else {
      this.histograms.set(key, { values: [value], labels });
    }
  }

  summary(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.makeKey(name, labels);
    const current = this.summaries.get(key);
    if (current) {
      if (current.values.length >= this.maxObservations) {
        current.values.shift();
      }
      current.values.push(value);
    } else {
      this.summaries.set(key, { values: [value], labels });
    }
  }

  getMetrics(): Metric[] {
    const metrics: Metric[] = [];
    const now = Date.now();

    // Counters
    for (const [key, data] of this.counters.entries()) {
      const name = key.split('{')[0] ?? key;
      metrics.push({
        name,
        type: 'counter',
        help: `Counter: ${name}`,
        labels: data.labels,
        value: data.value,
        timestamp: now,
      });
    }

    // Gauges
    for (const [key, data] of this.gauges.entries()) {
      const name = key.split('{')[0] ?? key;
      metrics.push({
        name,
        type: 'gauge',
        help: `Gauge: ${name}`,
        labels: data.labels,
        value: data.value,
        timestamp: now,
      });
    }

    // Histograms
    for (const [key, data] of this.histograms.entries()) {
      const name = key.split('{')[0] ?? key;
      const buckets = this.calculateBuckets(data.values);
      metrics.push({
        name,
        type: 'histogram',
        help: `Histogram: ${name}`,
        labels: data.labels,
        value: data.values.length,
        timestamp: now,
        buckets,
        sum: data.values.reduce((a, b) => a + b, 0),
        count: data.values.length,
      } as HistogramMetric);
    }

    // Summaries
    for (const [key, data] of this.summaries.entries()) {
      const name = key.split('{')[0] ?? key;
      const quantiles = this.calculateQuantiles(data.values);
      metrics.push({
        name,
        type: 'summary',
        help: `Summary: ${name}`,
        labels: data.labels,
        value: data.values.length,
        timestamp: now,
        quantiles,
        sum: data.values.reduce((a, b) => a + b, 0),
        count: data.values.length,
      } as SummaryMetric);
    }

    return metrics;
  }

  toPrometheus(): string {
    const lines: string[] = [];
    const metrics = this.getMetrics();

    for (const metric of metrics) {
      lines.push(`# HELP ${metric.name} ${metric.help}`);
      lines.push(`# TYPE ${metric.name} ${metric.type}`);

      const labels = metric.labels
        ? `{${Object.entries(metric.labels)
            .map(([k, v]) => `${k}="${v}"`)
            .join(',')}}`
        : '';

      if (metric.type === 'histogram') {
        const hist = metric as HistogramMetric;
        for (const bucket of hist.buckets) {
          lines.push(
            `${metric.name}_bucket${labels.replace('}', `,le="${bucket.le}"}`) || `{le="${bucket.le}"}`} ${bucket.count}`
          );
        }
        lines.push(`${metric.name}_sum${labels} ${hist.sum}`);
        lines.push(`${metric.name}_count${labels} ${hist.count}`);
      } else if (metric.type === 'summary') {
        const sum = metric as SummaryMetric;
        for (const q of sum.quantiles) {
          lines.push(
            `${metric.name}${labels.replace('}', `,quantile="${q.quantile}"}`) || `{quantile="${q.quantile}"}`} ${q.value}`
          );
        }
        lines.push(`${metric.name}_sum${labels} ${sum.sum}`);
        lines.push(`${metric.name}_count${labels} ${sum.count}`);
      } else {
        lines.push(`${metric.name}${labels} ${metric.value}`);
      }
    }

    return lines.join('\n');
  }

  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.summaries.clear();
  }

  // ==========================================================================
  // CONVENIENCE METHODS
  // ==========================================================================

  /** Record operation duration */
  recordDuration(name: string, startTime: number, labels?: Record<string, string>): void {
    const duration = Date.now() - startTime;
    this.histogram(name, duration, labels);
  }

  /** Get counter value */
  getCounter(name: string, labels?: Record<string, string>): number {
    const key = this.makeKey(name, labels);
    return this.counters.get(key)?.value || 0;
  }

  /** Get gauge value */
  getGauge(name: string, labels?: Record<string, string>): number | undefined {
    const key = this.makeKey(name, labels);
    return this.gauges.get(key)?.value;
  }

  /** Get histogram statistics */
  getHistogramStats(
    name: string,
    labels?: Record<string, string>
  ):
    | {
        count: number;
        sum: number;
        avg: number;
        min: number;
        max: number;
        p50: number;
        p95: number;
        p99: number;
      }
    | undefined {
    const key = this.makeKey(name, labels);
    const data = this.histograms.get(key);
    if (!data || data.values.length === 0) return undefined;

    const sorted = [...data.values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      count: sorted.length,
      sum,
      avg: sum / sorted.length,
      min: sorted[0] ?? 0,
      max: sorted[sorted.length - 1] ?? 0,
      p50: this.percentile(sorted, 0.5),
      p95: this.percentile(sorted, 0.95),
      p99: this.percentile(sorted, 0.99),
    };
  }

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  private makeKey(name: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name;
    }
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    return `${name}{${labelStr}}`;
  }

  private calculateBuckets(values: number[]): HistogramBucket[] {
    return this.defaultBuckets.map((le) => ({
      le,
      count: values.filter((v) => v <= le).length,
    }));
  }

  private calculateQuantiles(values: number[]): SummaryQuantile[] {
    if (values.length === 0) {
      return this.defaultQuantiles.map((q) => ({ quantile: q, value: 0 }));
    }

    const sorted = [...values].sort((a, b) => a - b);
    return this.defaultQuantiles.map((quantile) => ({
      quantile,
      value: this.percentile(sorted, quantile),
    }));
  }

  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil(p * sorted.length) - 1;
    return sorted[Math.max(0, index)] ?? 0;
  }
}

// ============================================================================
// NULL METRICS COLLECTOR
// ============================================================================

export const nullMetricsCollector: IMetricsCollector = {
  increment: () => {},
  gauge: () => {},
  histogram: () => {},
  summary: () => {},
  getMetrics: () => [],
  toPrometheus: () => '',
  reset: () => {},
};

// ============================================================================
// METRICS HELPER FOR SERVICES
// ============================================================================

export class ServiceMetrics {
  private collector: IMetricsCollector;
  private prefix: string;

  constructor(collector: IMetricsCollector, prefix: string) {
    this.collector = collector;
    this.prefix = prefix;
  }

  /** Record successful operation */
  success(operation: string, duration: number, labels?: Record<string, string>): void {
    this.collector.increment(`${this.prefix}_${operation}_total`, { ...labels, status: 'success' });
    this.collector.histogram(`${this.prefix}_${operation}_duration_ms`, duration, labels);
  }

  /** Record failed operation */
  failure(
    operation: string,
    duration: number,
    errorCode: string,
    labels?: Record<string, string>
  ): void {
    this.collector.increment(`${this.prefix}_${operation}_total`, { ...labels, status: 'failure' });
    this.collector.increment(`${this.prefix}_${operation}_errors_total`, {
      ...labels,
      error: errorCode,
    });
    this.collector.histogram(`${this.prefix}_${operation}_duration_ms`, duration, labels);
  }

  /** Record a value (e.g., trade volume) */
  recordValue(metric: string, value: number, labels?: Record<string, string>): void {
    this.collector.histogram(`${this.prefix}_${metric}`, value, labels);
  }

  /** Set a gauge (e.g., queue size) */
  setGauge(metric: string, value: number, labels?: Record<string, string>): void {
    this.collector.gauge(`${this.prefix}_${metric}`, value, labels);
  }

  /** Create a timer for measuring duration */
  startTimer(): () => number {
    const start = Date.now();
    return () => Date.now() - start;
  }
}
