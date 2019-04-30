import React from 'react';
import { storiesOf } from '@storybook/react';
import KChart from './KChart';
import { TimeSeries } from '../../types/Metrics';
import { getDataSupplier } from '../../utils/victoryChartsUtils';

import '@patternfly/react-core/dist/styles/base.css';
import { ChartModel } from '../../types/Dashboards';

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

const empty: ChartModel = {
  name: 'Test empty',
  unit: 'bytes',
  spans: 6,
  metric: []
};

const withData: ChartModel = {
  name: 'Test with data',
  unit: 'bytes',
  spans: 6,
  metric: genSeries(['a', 'b', 'c'])
};

storiesOf('PF3 KChart', module)
  .add('empty', () => (
    <KChart
      chart={empty}
      dataSupplier={getDataSupplier(empty, new Map())!} />
  ))
  .add('with data', () => (
    <KChart
      chart={withData}
      dataSupplier={getDataSupplier(withData, new Map())!} />
  )); 
