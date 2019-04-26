import React from 'react';
import { storiesOf } from '@storybook/react';
import MetricsChart from './MetricsChart';
import { TimeSeries } from '../../types/Metrics';

const genSeries = (names: string[]): TimeSeries[] => {
  const t0 = 1556269000;
  return names.map(name => {
    const values: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const x = t0 + 10 * i;
      const y = Math.floor(Math.random() * 50);
      values.push([x, y]);
    }
    return {
      values: values,
      labelSet: { lbl: name }
    };
  });
}

storiesOf('MetricsChart', module)
  .add('empty', () => (
    <MetricsChart chartName="Test empty" unit="bytes" labelValues={new Map()} series={[]} />
  ))
  .add('with data', () => (
    <MetricsChart chartName="Test with data" unit="bytes" labelValues={new Map()} series={genSeries(['a', 'b', 'c'])} />
  )); 
