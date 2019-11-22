import React from 'react';
import { ChartScatter } from '@patternfly/react-charts';
import { storiesOf } from '@storybook/react';

import '@patternfly/react-core/dist/styles/base.css';
import ChartWithLegend from './ChartWithLegend';
import { VCLine } from '../types/VictoryChartInfo';

const traces: VCLine = {
  datapoints: [{
    x: 0,
    y: 62,
    name: 'Trace 1',
    unit: 'ms',
    size: 8
  }, {
    x: 4,
    y: 80,
    name: 'Trace 2',
    unit: 'ms',
    size: 4
  }, {
    x: 5,
    y: 83,
    name: 'Trace 3',
    unit: 'ms',
    size: 4
  }, {
    x: 8,
    y: 45,
    name: 'Trace 4',
    unit: 'ms',
    size: 5
  }, {
    x: 16,
    y: 152,
    name: 'Trace 5',
    unit: 'ms',
    size: 10
  }] as any,
  legendItem: {
    name: 'span duration'
  } as any
};

storiesOf('ChartWithLegend', module)
  .add('as scatter plots', () => {
    return <ChartWithLegend data={[traces]} unit="ms" seriesComponent={(<ChartScatter/>)} />;
  });
