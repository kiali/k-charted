import { ChartModel } from '../Dashboards';
import { TimeSeries } from '../Metrics';

const t0 = 1556802000;
const increment = 60;

const genSeries = (names: string[]): TimeSeries[] => {
  return names.map(name => {
    const values: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const x = t0 + increment * i;
      const y = Math.floor(Math.random() * 50);
      values.push([x, y]);
    }
    return {
      values: values,
      labelSet: { lbl: name }
    };
  });
};

export const generateRandomMetricChart = (names: string[]): ChartModel => {
  return {
    name: 'Random metric chart',
    unit: 'bytes',
    spans: 6,
    metric: genSeries(names)
  };
};

export const empty: ChartModel = {
  name: 'Empty metric chart',
  unit: 'bytes',
  spans: 6,
  metric: []
};

export const error: ChartModel = {
  name: 'Chart with error',
  unit: 'bytes',
  spans: 6,
  metric: [],
  error: 'Unable to fetch metrics'
};

export const metric: ChartModel = {
  name: 'Metric chart',
  unit: 'bytes',
  spans: 6,
  metric: [{
    values: [[t0, 50.4], [t0 + increment, 48.2], [t0 + 2 * increment, 42.0]],
    labelSet: {}
  }]
};

export const histogram: ChartModel = {
  name: 'Histogram chart',
  unit: 'bytes',
  spans: 6,
  histogram: {
    avg: [{
      values: [[t0, 50.4], [t0 + increment, 48.2], [t0 + 2 * increment, 42.0]],
      labelSet: {}
    }],
    '0.99': [{
      values: [[t0, 150.4], [t0 + increment, 148.2], [t0 + 2 * increment, 142.0]],
      labelSet: {}
    }]
  }
};
