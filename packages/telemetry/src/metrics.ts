/**
 * Metrics collection — counters, gauges, and histograms.
 *
 * Provides pure-JS implementations that work without OTel installed,
 * plus bridges for OpenTelemetry and Prometheus exposition formats.
 */

export interface Counter {
  readonly name: string;
  readonly labels: Record<string, string>;
  increment(value?: number): void;
  getValue(): number;
}

export interface Gauge {
  readonly name: string;
  readonly labels: Record<string, string>;
  set(value: number): void;
  getValue(): number;
}

export interface Histogram {
  readonly name: string;
  readonly labels: Record<string, string>;
  readonly buckets: number[];
  observe(value: number): void;
  getCounts(): Record<string, number>;
  getSum(): number;
  getCount(): number;
}

export interface MetricsCollector {
  counter(name: string, labels?: Record<string, string>): Counter;
  gauge(name: string, labels?: Record<string, string>): Gauge;
  histogram(name: string, buckets: number[], labels?: Record<string, string>): Histogram;
}

// ---------------------------------------------------------------------------
// InMemoryMetricsCollector — default, works without any external deps
// ---------------------------------------------------------------------------

class InMemoryCounter implements Counter {
  private _value = 0;

  constructor(
    readonly name: string,
    readonly labels: Record<string, string> = {}
  ) {}

  increment(value = 1): void {
    this._value += value;
  }

  getValue(): number {
    return this._value;
  }
}

class InMemoryGauge implements Gauge {
  private _value = 0;

  constructor(
    readonly name: string,
    readonly labels: Record<string, string> = {}
  ) {}

  set(value: number): void {
    this._value = value;
  }

  getValue(): number {
    return this._value;
  }
}

class InMemoryHistogram implements Histogram {
  private _counts: Record<string, number> = {};
  private _sum = 0;
  private _count = 0;

  constructor(
    readonly name: string,
    readonly buckets: number[],
    readonly labels: Record<string, string> = {}
  ) {
    for (const bucket of buckets) {
      this._counts[bucket.toString()] = 0;
    }
    this._counts['+Inf'] = 0;
  }

  observe(value: number): void {
    this._sum += value;
    this._count++;
    for (const bucket of this.buckets) {
      if (value <= bucket) {
        this._counts[bucket.toString()]!++;
      }
    }
    this._counts['+Inf']!++;
  }

  getCounts(): Record<string, number> {
    return { ...this._counts };
  }

  getSum(): number {
    return this._sum;
  }

  getCount(): number {
    return this._count;
  }
}

export function createInMemoryMetricsCollector(): MetricsCollector {
  const counters = new Map<string, InMemoryCounter>();
  const gauges = new Map<string, InMemoryGauge>();
  const histograms = new Map<string, InMemoryHistogram>();

  function key(name: string, labels: Record<string, string>): string {
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return labelStr ? `${name}{${labelStr}}` : name;
  }

  return {
    counter(name, labels = {}) {
      const k = key(name, labels);
      if (!counters.has(k)) {
        counters.set(k, new InMemoryCounter(name, labels));
      }
      return counters.get(k)!;
    },
    gauge(name, labels = {}) {
      const k = key(name, labels);
      if (!gauges.has(k)) {
        gauges.set(k, new InMemoryGauge(name, labels));
      }
      return gauges.get(k)!;
    },
    histogram(name, buckets, labels = {}) {
      const k = key(name, labels);
      if (!histograms.has(k)) {
        histograms.set(k, new InMemoryHistogram(name, buckets, labels));
      }
      return histograms.get(k)!;
    },
  };
}

// ---------------------------------------------------------------------------
// Prometheus exposition format
// ---------------------------------------------------------------------------

export class PrometheusMetricsCollector implements MetricsCollector {
  private _inner = createInMemoryMetricsCollector();
  private _counters = new Map<string, InMemoryCounter>();
  private _gauges = new Map<string, InMemoryGauge>();
  private _histograms = new Map<string, InMemoryHistogram>();

  counter(name: string, labels?: Record<string, string>): Counter {
    const c = this._inner.counter(name, labels);
    const k = this._key(name, labels ?? {});
    if (!this._counters.has(k)) this._counters.set(k, c as InMemoryCounter);
    return c;
  }

  gauge(name: string, labels?: Record<string, string>): Gauge {
    const g = this._inner.gauge(name, labels);
    const k = this._key(name, labels ?? {});
    if (!this._gauges.has(k)) this._gauges.set(k, g as InMemoryGauge);
    return g;
  }

  histogram(name: string, buckets: number[], labels?: Record<string, string>): Histogram {
    const h = this._inner.histogram(name, buckets, labels);
    const k = this._key(name, labels ?? {});
    if (!this._histograms.has(k)) this._histograms.set(k, h as InMemoryHistogram);
    return h;
  }

  private _key(name: string, labels: Record<string, string>): string {
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return labelStr ? `${name}{${labelStr}}` : name;
  }

  renderPrometheusText(): string {
    const lines: string[] = [];

    for (const c of this._counters.values()) {
      lines.push(`# TYPE ${c.name} counter`);
      const labelStr = formatLabels(c.labels);
      lines.push(`${c.name}${labelStr} ${c.getValue()}`);
    }

    for (const g of this._gauges.values()) {
      lines.push(`# TYPE ${g.name} gauge`);
      const labelStr = formatLabels(g.labels);
      lines.push(`${g.name}${labelStr} ${g.getValue()}`);
    }

    for (const h of this._histograms.values()) {
      lines.push(`# TYPE ${h.name} histogram`);
      const labelStr = formatLabels(h.labels);
      const counts = h.getCounts();
      for (const bucket of h.buckets) {
        const bucketLabel = labelStr
          ? `${labelStr.slice(0, -1)},le="${bucket}")`
          : `{le="${bucket}"}`;
        lines.push(`${h.name}_bucket${bucketLabel} ${counts[bucket.toString()]}`);
      }
      const infLabel = labelStr ? `${labelStr.slice(0, -1)},le="+Inf")` : `{le="+Inf"}`;
      lines.push(`${h.name}_bucket${infLabel} ${counts['+Inf']}`);
      lines.push(`${h.name}_sum${labelStr} ${h.getSum()}`);
      lines.push(`${h.name}_count${labelStr} ${h.getCount()}`);
    }

    return lines.join('\n') + '\n';
  }
}

function formatLabels(labels: Record<string, string>): string {
  const entries = Object.entries(labels);
  if (entries.length === 0) return '';
  const pairs = entries.map(([k, v]) => `${k}="${v}"`).join(',');
  return `{${pairs}}`;
}
