import { describe, it, expect, beforeEach } from 'vitest';

import {
  InMemoryMetricsCollector,
  ServiceMetrics,
  nullMetricsCollector,
  METRIC_NAMES,
} from '../src/metrics';
import type { HistogramMetric, SummaryMetric } from '../src/metrics';

describe('InMemoryMetricsCollector', () => {
  let collector: InMemoryMetricsCollector;

  beforeEach(() => {
    collector = new InMemoryMetricsCollector();
  });

  // ==========================================================================
  // Counter Tests
  // ==========================================================================

  describe('increment (counter)', () => {
    it('should increment by 1 by default', () => {
      collector.increment('test_counter');
      expect(collector.getCounter('test_counter')).toBe(1);
    });

    it('should increment by a specified value', () => {
      collector.increment('test_counter', undefined, 5);
      expect(collector.getCounter('test_counter')).toBe(5);
    });

    it('should accumulate multiple increments', () => {
      collector.increment('test_counter');
      collector.increment('test_counter');
      collector.increment('test_counter', undefined, 3);
      expect(collector.getCounter('test_counter')).toBe(5);
    });

    it('should track counters with labels separately', () => {
      collector.increment('http_requests', { method: 'GET' });
      collector.increment('http_requests', { method: 'POST' });
      collector.increment('http_requests', { method: 'GET' });

      expect(collector.getCounter('http_requests', { method: 'GET' })).toBe(2);
      expect(collector.getCounter('http_requests', { method: 'POST' })).toBe(1);
    });
  });

  // ==========================================================================
  // Gauge Tests
  // ==========================================================================

  describe('gauge', () => {
    it('should set a gauge value', () => {
      collector.gauge('temperature', 72.5);
      expect(collector.getGauge('temperature')).toBe(72.5);
    });

    it('should overwrite a gauge value', () => {
      collector.gauge('temperature', 72.5);
      collector.gauge('temperature', 85.0);
      expect(collector.getGauge('temperature')).toBe(85.0);
    });

    it('should track gauges with labels separately', () => {
      collector.gauge('queue_size', 10, { queue: 'alpha' });
      collector.gauge('queue_size', 20, { queue: 'beta' });

      expect(collector.getGauge('queue_size', { queue: 'alpha' })).toBe(10);
      expect(collector.getGauge('queue_size', { queue: 'beta' })).toBe(20);
    });
  });

  // ==========================================================================
  // Histogram Tests
  // ==========================================================================

  describe('histogram', () => {
    it('should record values and compute stats', () => {
      collector.histogram('request_duration', 100);
      collector.histogram('request_duration', 200);
      collector.histogram('request_duration', 300);

      const stats = collector.getHistogramStats('request_duration');
      expect(stats).toBeDefined();
      expect(stats!.count).toBe(3);
      expect(stats!.sum).toBe(600);
      expect(stats!.avg).toBe(200);
      expect(stats!.min).toBe(100);
      expect(stats!.max).toBe(300);
    });

    it('should calculate buckets correctly', () => {
      collector.histogram('latency', 5);
      collector.histogram('latency', 15);
      collector.histogram('latency', 150);

      const metrics = collector.getMetrics();
      const histMetric = metrics.find(
        (m) => m.name === 'latency' && m.type === 'histogram'
      ) as HistogramMetric;

      expect(histMetric).toBeDefined();
      expect(histMetric.buckets).toBeDefined();
      // le=5 bucket should contain 1 value (5)
      const bucket5 = histMetric.buckets.find((b) => b.le === 5);
      expect(bucket5!.count).toBe(1);
      // le=25 bucket should contain 2 values (5, 15)
      const bucket25 = histMetric.buckets.find((b) => b.le === 25);
      expect(bucket25!.count).toBe(2);
      // le=250 bucket should contain all 3 values
      const bucket250 = histMetric.buckets.find((b) => b.le === 250);
      expect(bucket250!.count).toBe(3);
    });

    it('should include sum and count in histogram metric', () => {
      collector.histogram('latency', 10);
      collector.histogram('latency', 30);

      const metrics = collector.getMetrics();
      const histMetric = metrics.find(
        (m) => m.name === 'latency' && m.type === 'histogram'
      ) as HistogramMetric;

      expect(histMetric.sum).toBe(40);
      expect(histMetric.count).toBe(2);
    });

    it('should track histograms with labels separately', () => {
      collector.histogram('duration', 100, { endpoint: '/api/a' });
      collector.histogram('duration', 500, { endpoint: '/api/b' });

      const statsA = collector.getHistogramStats('duration', { endpoint: '/api/a' });
      const statsB = collector.getHistogramStats('duration', { endpoint: '/api/b' });

      expect(statsA!.avg).toBe(100);
      expect(statsB!.avg).toBe(500);
    });
  });

  // ==========================================================================
  // Summary Tests
  // ==========================================================================

  describe('summary', () => {
    it('should record values and compute quantiles', () => {
      // Record 100 values from 1 to 100
      for (let i = 1; i <= 100; i++) {
        collector.summary('response_size', i);
      }

      const metrics = collector.getMetrics();
      const summaryMetric = metrics.find(
        (m) => m.name === 'response_size' && m.type === 'summary'
      ) as SummaryMetric;

      expect(summaryMetric).toBeDefined();
      expect(summaryMetric.quantiles).toBeDefined();
      expect(summaryMetric.count).toBe(100);
      expect(summaryMetric.sum).toBe(5050); // sum of 1..100

      // Check quantile values
      const q50 = summaryMetric.quantiles.find((q) => q.quantile === 0.5);
      expect(q50).toBeDefined();
      expect(q50!.value).toBe(50);

      const q99 = summaryMetric.quantiles.find((q) => q.quantile === 0.99);
      expect(q99).toBeDefined();
      expect(q99!.value).toBe(99);
    });

    it('should track summaries with labels separately', () => {
      collector.summary('payload_size', 100, { service: 'alpha' });
      collector.summary('payload_size', 500, { service: 'beta' });

      const metrics = collector.getMetrics();
      const summaryMetrics = metrics.filter(
        (m) => m.name === 'payload_size' && m.type === 'summary'
      ) as SummaryMetric[];

      expect(summaryMetrics).toHaveLength(2);
    });
  });

  // ==========================================================================
  // getMetrics Tests
  // ==========================================================================

  describe('getMetrics', () => {
    it('should return all metric types', () => {
      collector.increment('my_counter');
      collector.gauge('my_gauge', 42);
      collector.histogram('my_histogram', 100);
      collector.summary('my_summary', 200);

      const metrics = collector.getMetrics();
      const types = metrics.map((m) => m.type);

      expect(types).toContain('counter');
      expect(types).toContain('gauge');
      expect(types).toContain('histogram');
      expect(types).toContain('summary');
    });

    it('should include timestamp on each metric', () => {
      collector.increment('my_counter');

      const metrics = collector.getMetrics();
      expect(metrics[0].timestamp).toBeGreaterThan(0);
      expect(metrics[0].timestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  // ==========================================================================
  // toPrometheus Tests
  // ==========================================================================

  describe('toPrometheus', () => {
    it('should format counters correctly', () => {
      collector.increment('http_total', undefined, 5);

      const output = collector.toPrometheus();
      expect(output).toContain('# HELP http_total Counter: http_total');
      expect(output).toContain('# TYPE http_total counter');
      expect(output).toContain('http_total 5');
    });

    it('should format gauges correctly', () => {
      collector.gauge('queue_depth', 42);

      const output = collector.toPrometheus();
      expect(output).toContain('# HELP queue_depth Gauge: queue_depth');
      expect(output).toContain('# TYPE queue_depth gauge');
      expect(output).toContain('queue_depth 42');
    });

    it('should format histograms with buckets, sum, and count', () => {
      collector.histogram('latency', 50);
      collector.histogram('latency', 150);

      const output = collector.toPrometheus();
      expect(output).toContain('# TYPE latency histogram');
      expect(output).toContain('latency_bucket');
      expect(output).toContain('latency_sum 200');
      expect(output).toContain('latency_count 2');
    });

    it('should format summaries with quantiles, sum, and count', () => {
      collector.summary('size', 100);
      collector.summary('size', 200);

      const output = collector.toPrometheus();
      expect(output).toContain('# TYPE size summary');
      expect(output).toContain('quantile=');
      expect(output).toContain('size_sum 300');
      expect(output).toContain('size_count 2');
    });

    it('should format labels correctly', () => {
      collector.increment('http_requests', { method: 'GET', status: '200' });

      const output = collector.toPrometheus();
      expect(output).toContain('method="GET"');
      expect(output).toContain('status="200"');
    });
  });

  // ==========================================================================
  // reset Tests
  // ==========================================================================

  describe('reset', () => {
    it('should clear all metrics', () => {
      collector.increment('counter_a');
      collector.gauge('gauge_a', 10);
      collector.histogram('hist_a', 50);
      collector.summary('sum_a', 100);

      collector.reset();

      const metrics = collector.getMetrics();
      expect(metrics).toHaveLength(0);
      expect(collector.getCounter('counter_a')).toBe(0);
      expect(collector.getGauge('gauge_a')).toBeUndefined();
      expect(collector.getHistogramStats('hist_a')).toBeUndefined();
    });
  });

  // ==========================================================================
  // getCounter Tests
  // ==========================================================================

  describe('getCounter', () => {
    it('should return the current counter value', () => {
      collector.increment('ops_total', undefined, 7);
      expect(collector.getCounter('ops_total')).toBe(7);
    });

    it('should return 0 for an unknown counter', () => {
      expect(collector.getCounter('nonexistent')).toBe(0);
    });
  });

  // ==========================================================================
  // getGauge Tests
  // ==========================================================================

  describe('getGauge', () => {
    it('should return the current gauge value', () => {
      collector.gauge('cpu_usage', 65.3);
      expect(collector.getGauge('cpu_usage')).toBe(65.3);
    });

    it('should return undefined for an unknown gauge', () => {
      expect(collector.getGauge('nonexistent')).toBeUndefined();
    });
  });

  // ==========================================================================
  // getHistogramStats Tests
  // ==========================================================================

  describe('getHistogramStats', () => {
    it('should return p50, p95, p99, min, max, avg, sum, count', () => {
      for (let i = 1; i <= 100; i++) {
        collector.histogram('req_latency', i);
      }

      const stats = collector.getHistogramStats('req_latency');
      expect(stats).toBeDefined();
      expect(stats!.count).toBe(100);
      expect(stats!.sum).toBe(5050);
      expect(stats!.avg).toBe(50.5);
      expect(stats!.min).toBe(1);
      expect(stats!.max).toBe(100);
      expect(stats!.p50).toBe(50);
      expect(stats!.p95).toBe(95);
      expect(stats!.p99).toBe(99);
    });

    it('should return undefined for an unknown histogram', () => {
      expect(collector.getHistogramStats('nonexistent')).toBeUndefined();
    });
  });

  // ==========================================================================
  // recordDuration Tests
  // ==========================================================================

  describe('recordDuration', () => {
    it('should record a time-based histogram value', () => {
      const startTime = Date.now() - 150; // Simulate 150ms ago
      collector.recordDuration('op_duration', startTime);

      const stats = collector.getHistogramStats('op_duration');
      expect(stats).toBeDefined();
      expect(stats!.count).toBe(1);
      // Duration should be approximately 150ms (allow some tolerance)
      expect(stats!.min).toBeGreaterThanOrEqual(140);
      expect(stats!.min).toBeLessThan(300);
    });
  });
});

// ============================================================================
// ServiceMetrics Tests
// ============================================================================

describe('ServiceMetrics', () => {
  let collector: InMemoryMetricsCollector;
  let serviceMetrics: ServiceMetrics;

  beforeEach(() => {
    collector = new InMemoryMetricsCollector();
    serviceMetrics = new ServiceMetrics(collector, 'myservice');
  });

  describe('success', () => {
    it('should record a success counter and duration histogram', () => {
      serviceMetrics.success('register', 250);

      expect(collector.getCounter('myservice_register_total', { status: 'success' })).toBe(1);

      const stats = collector.getHistogramStats('myservice_register_duration_ms');
      expect(stats).toBeDefined();
      expect(stats!.count).toBe(1);
      expect(stats!.sum).toBe(250);
    });
  });

  describe('failure', () => {
    it('should record failure counter, error counter, and duration histogram', () => {
      serviceMetrics.failure('register', 100, 'TIMEOUT');

      expect(collector.getCounter('myservice_register_total', { status: 'failure' })).toBe(1);
      expect(collector.getCounter('myservice_register_errors_total', { error: 'TIMEOUT' })).toBe(1);

      const stats = collector.getHistogramStats('myservice_register_duration_ms');
      expect(stats).toBeDefined();
      expect(stats!.sum).toBe(100);
    });
  });

  describe('recordValue', () => {
    it('should record a histogram value with the service prefix', () => {
      serviceMetrics.recordValue('trade_volume', 1000);

      const stats = collector.getHistogramStats('myservice_trade_volume');
      expect(stats).toBeDefined();
      expect(stats!.sum).toBe(1000);
    });
  });

  describe('setGauge', () => {
    it('should set a gauge with the service prefix', () => {
      serviceMetrics.setGauge('queue_size', 42);
      expect(collector.getGauge('myservice_queue_size')).toBe(42);
    });
  });

  describe('startTimer', () => {
    it('should return a function that computes elapsed time', () => {
      const stop = serviceMetrics.startTimer();
      // Simulate some small delay
      const elapsed = stop();
      expect(elapsed).toBeGreaterThanOrEqual(0);
      expect(typeof elapsed).toBe('number');
    });
  });
});

// ============================================================================
// nullMetricsCollector Tests
// ============================================================================

describe('nullMetricsCollector', () => {
  it('should have all interface methods as no-ops', () => {
    // These should not throw
    expect(() => nullMetricsCollector.increment('test')).not.toThrow();
    expect(() => nullMetricsCollector.gauge('test', 1)).not.toThrow();
    expect(() => nullMetricsCollector.histogram('test', 1)).not.toThrow();
    expect(() => nullMetricsCollector.summary('test', 1)).not.toThrow();
    expect(() => nullMetricsCollector.reset()).not.toThrow();
  });

  it('should return empty metrics', () => {
    expect(nullMetricsCollector.getMetrics()).toEqual([]);
  });

  it('should return empty prometheus string', () => {
    expect(nullMetricsCollector.toPrometheus()).toBe('');
  });
});

// ============================================================================
// METRIC_NAMES Tests
// ============================================================================

describe('METRIC_NAMES', () => {
  it('should define standard metric names', () => {
    expect(METRIC_NAMES.REGISTRATION_TOTAL).toBe('gtcx_registration_total');
    expect(METRIC_NAMES.TRADE_TOTAL).toBe('gtcx_trade_total');
    expect(METRIC_NAMES.COMPLIANCE_CHECK_TOTAL).toBe('gtcx_compliance_check_total');
    expect(METRIC_NAMES.QUEUE_SIZE).toBe('gtcx_queue_size');
    expect(METRIC_NAMES.VALIDATION_DURATION).toBe('gtcx_validation_duration_ms');
  });
});
