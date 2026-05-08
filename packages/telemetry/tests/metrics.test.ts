import { describe, it, expect } from 'vitest';

import { createInMemoryMetricsCollector, PrometheusMetricsCollector } from '../src/metrics';

describe('InMemoryMetricsCollector', () => {
  it('creates counters', () => {
    const mc = createInMemoryMetricsCollector();
    const c = mc.counter('requests', { method: 'GET' });
    expect(c.getValue()).toBe(0);
    c.increment();
    expect(c.getValue()).toBe(1);
    c.increment(4);
    expect(c.getValue()).toBe(5);
  });

  it('reuses counters with same name and labels', () => {
    const mc = createInMemoryMetricsCollector();
    const c1 = mc.counter('requests', { method: 'GET' });
    c1.increment();
    const c2 = mc.counter('requests', { method: 'GET' });
    expect(c2.getValue()).toBe(1);
    expect(c1).toBe(c2);
  });

  it('creates gauges', () => {
    const mc = createInMemoryMetricsCollector();
    const g = mc.gauge('temperature');
    g.set(23.5);
    expect(g.getValue()).toBe(23.5);
    g.set(25);
    expect(g.getValue()).toBe(25);
  });

  it('creates histograms with buckets', () => {
    const mc = createInMemoryMetricsCollector();
    const h = mc.histogram('latency', [10, 50, 100, 500]);

    h.observe(5);
    h.observe(30);
    h.observe(200);

    const counts = h.getCounts();
    expect(counts['10']).toBe(1);
    expect(counts['50']).toBe(2);
    expect(counts['100']).toBe(2);
    expect(counts['500']).toBe(3);
    expect(counts['+Inf']).toBe(3);
    expect(h.getSum()).toBe(235);
    expect(h.getCount()).toBe(3);
  });
});

describe('PrometheusMetricsCollector', () => {
  it('renders counter in prometheus format', () => {
    const mc = new PrometheusMetricsCollector();
    mc.counter('requests_total', { method: 'GET' }).increment(5);

    const text = mc.renderPrometheusText();
    expect(text).toContain('# TYPE requests_total counter');
    expect(text).toContain('requests_total{method="GET"} 5');
  });

  it('renders gauge in prometheus format', () => {
    const mc = new PrometheusMetricsCollector();
    mc.gauge('temperature_celsius').set(23.5);

    const text = mc.renderPrometheusText();
    expect(text).toContain('# TYPE temperature_celsius gauge');
    expect(text).toContain('temperature_celsius 23.5');
  });

  it('renders histogram in prometheus format', () => {
    const mc = new PrometheusMetricsCollector();
    const h = mc.histogram('latency_ms', [10, 100]);
    h.observe(5);
    h.observe(50);
    h.observe(200);

    const text = mc.renderPrometheusText();
    expect(text).toContain('# TYPE latency_ms histogram');
    expect(text).toContain('latency_ms_bucket{le="10"} 1');
    expect(text).toContain('latency_ms_bucket{le="100"} 2');
    expect(text).toContain('latency_ms_bucket{le="+Inf"} 3');
    expect(text).toContain('latency_ms_sum 255');
    expect(text).toContain('latency_ms_count 3');
  });
});
