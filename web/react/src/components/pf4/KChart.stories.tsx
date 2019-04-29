import React from 'react';
import { storiesOf } from '@storybook/react';
import KChart from './KChart';
import { TimeSeries } from '../../types/Metrics';
import { metricsDataSupplier } from '../../utils/victoryChartsUtils';

import '@patternfly/react-core/dist/styles/base.css';

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

storiesOf('PF4 KChart', module)
  .add('empty', () => (
    <KChart
      chartName="Test empty"
      unit="bytes"
      dataSupplier={metricsDataSupplier('Test empty', [], new Map())} />
  ))
  .add('with data', () => (
    <KChart
      chartName="Test with data"
      unit="bytes"
      dataSupplier={metricsDataSupplier('Test with data', genSeries(['a', 'b', 'c']), new Map())} />
  )); 
