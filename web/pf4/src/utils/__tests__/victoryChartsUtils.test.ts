import { getDataSupplier, findClosestDatapoint, toBuckets } from '../victoryChartsUtils';
import { empty, histogram, metric, metricWithLabels, emptyLabels, labelsWithPrettifier } from '../../types/__mocks__/Charts.mock';
import { ChartModel } from '../..';
import { RawOrBucket, LineInfo } from '../../types/VictoryChartInfo';

const t0 = new Date('2019-05-02T13:00:00.000Z');
const t1 = new Date('2019-05-02T13:01:00.000Z');
const t2 = new Date('2019-05-02T13:02:00.000Z');

const colors = ['red', 'green', 'blue'];

describe('Victory Charts Utils', () => {
  it('should provide empty columns for empty metric', () => {
    const res = getDataSupplier(empty, emptyLabels, colors)!();
    expect(res).toHaveLength(0);
  });

  it('should provide columns for metric', () => {
    const res = getDataSupplier(metric, emptyLabels, colors)!();
    expect(res).toHaveLength(1);
    expect(res[0].datapoints.map(s => s.x)).toEqual([t0, t1, t2]);
    expect(res[0].datapoints.map(s => s.y)).toEqual([50.4, 48.2, 42]);
    expect(res[0].datapoints.map(s => s.name)).toEqual(['Metric chart', 'Metric chart', 'Metric chart']);
  });

  it('should provide columns for histogram', () => {
    const res = getDataSupplier(histogram, emptyLabels, colors)!();
    expect(res).toHaveLength(2);
    expect(res[0].datapoints.map(s => s.x)).toEqual([t0, t1, t2]);
    expect(res[0].datapoints.map(s => s.y)).toEqual([50.4, 48.2, 42]);
    expect(res[0].datapoints.map(s => s.name)).toEqual(['avg', 'avg', 'avg']);
    expect(res[1].datapoints.map(s => s.x)).toEqual([t0, t1, t2]);
    expect(res[1].datapoints.map(s => s.y)).toEqual([150.4, 148.2, 142]);
    expect(res[1].datapoints.map(s => s.name)).toEqual(['p99', 'p99', 'p99']);
  });

  it('should ignore NaN values', () => {
    const withNaN: ChartModel = {
      name: '',
      unit: '',
      spans: 6,
      metrics: [{
        values: [[1, 1], [2, 2], [3, NaN], [4, 4]],
        labelSet: {}
      }],
      startCollapsed: false
    };

    const res = getDataSupplier(withNaN, emptyLabels, colors)!();
    expect(res).toHaveLength(1);
    expect(res[0].datapoints.map(s => s.y)).toEqual([1, 2, 4]);
  });

  it('should prettify labels', () => {
    const res = getDataSupplier(metricWithLabels, labelsWithPrettifier, colors)!();
    expect(res).toHaveLength(3);
    expect(res.map(s => s.legendItem.name)).toEqual(['OK', 'No content', 'foobar']);
    expect(res[0].datapoints.map(s => s.name)).toEqual(['OK']);
    expect(res[1].datapoints.map(s => s.name)).toEqual(['No content']);
    expect(res[2].datapoints.map(s => s.name)).toEqual(['foobar']);
  });

  it('should find closest data point', () => {
    const lines = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] as RawOrBucket[];
    // Remember that screen Y coordinate is reversed compared to domain!
    let point = findClosestDatapoint(lines, -50, -50, 10, 10);
    expect(point).toEqual({x: 0, y: 1});
    point = findClosestDatapoint(lines, 2, 0, 10, 10);
    expect(point).toEqual({x: 0, y: 1});
    point = findClosestDatapoint(lines, 7, 3, 10, 10);
    expect(point).toEqual({x: 1, y: 1});
    point = findClosestDatapoint(lines, 2, 12, 10, 10);
    expect(point).toEqual({x: 0, y: 0});
  });

  it('should not crash while finding closest data point', () => {
    let point = findClosestDatapoint([], 50, 50, 500, 500);
    expect(point).toBeUndefined();

    point = findClosestDatapoint([{ x: 0, y: 0 }] as RawOrBucket[], 50, 50, 0, 0);
    expect(point).toBeUndefined();
  });

  it('should find closest data point with different axis scales', () => {
    const lines = [{ x: 10000, y: 0 }, { x: 20000, y: 0 }, { x: 10005, y: 1 }, { x: 20005, y: 1 }] as RawOrBucket[];
    // Remember that screen Y coordinate is reversed compared to domain!
    let point = findClosestDatapoint(lines, -50, -50, 10, 10);
    expect(point).toEqual({x: 10005, y: 1});
    point = findClosestDatapoint(lines, 2, 0, 10, 10);
    expect(point).toEqual({x: 10005, y: 1});
    point = findClosestDatapoint(lines, 7, 3, 10, 10);
    expect(point).toEqual({x: 20005, y: 1});
    point = findClosestDatapoint(lines, 2, 12, 10, 10);
    expect(point).toEqual({x: 10000, y: 0});
  });

  it('should build empty buckets', () => {
    const buckets = toBuckets(4, [], {} as LineInfo);
    expect(buckets).toBeDefined();
    expect(buckets).toHaveLength(0);
  });

  it('should build buckets', () => {
    const dps = [
      { name: '', x: 10000, y: 0 },
      { name: '', x: 10100, y: -10 },
      { name: '', x: 10300, y: 15 },
      { name: '', x: 10800, y: 800 },
      { name: '', x: 12400, y: 10 },
      { name: '', x: 19100, y: -5 },
      { name: '', x: 19300, y: -10 },
      { name: '', x: 19400, y: -15 },
      { name: '', x: 20000, y: -20 }
    ];
    // Shuffle
    dps.sort(() => Math.random() - 0.5);

    const buckets = toBuckets(10, dps, {} as LineInfo);

    // From the 10 demanded buckets, only 3 aren't empty
    expect(buckets).toHaveLength(3);
    expect(buckets[0].x).toEqual(10500);
    expect(buckets[0].y).toHaveLength(4);
    expect(buckets[1].x).toEqual(12500);
    expect(buckets[1].y).toHaveLength(1);
    expect(buckets[2].x).toEqual(19500);
    expect(buckets[2].y).toHaveLength(4);
  });
});
