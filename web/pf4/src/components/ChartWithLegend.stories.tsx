import React from 'react';
import { ChartScatter } from '@patternfly/react-charts';
import { storiesOf } from '@storybook/react';

import '@patternfly/react-core/dist/styles/base.css';
import ChartWithLegend from './ChartWithLegend';
import { VCLine, makeLegend } from '../types/VictoryChartInfo';

const traces: VCLine = {
    datapoints: [{
      x: 0,
      y: 0.62,
      name: 'Trace 1',
      unit: 'seconds',
      size: 8
    }, {
      x: 4,
      y: 0.80,
      name: 'Trace 2',
      unit: 'seconds',
      size: 4
    }, {
      x: 5,
      y: 0.83,
      name: 'Trace 3',
      unit: 'seconds',
      size: 4
    }, {
      x: 8,
      y: 0.45,
      name: 'Trace 4',
      unit: 'seconds',
      size: 5
    }, {
      x: 16,
      y: 0.152,
      name: 'Trace 5',
      unit: 'seconds',
      size: 10
    }],
    legendItem: makeLegend('span duration', 'blue')
};

storiesOf('ChartWithLegend', module)
  .add('as scatter plots', () => {
    return <ChartWithLegend data={[traces]} unit="seconds" seriesComponent={(<ChartScatter/>)} onClick={dp => alert(`${dp.name}: [${dp.x}, ${dp.y}]`)} />;
  });

const tracesTime: VCLine = {
  datapoints: [{
    x: 1575987817125390,
    y: 0.62,
    name: 'Trace 1',
    unit: 'seconds',
    size: 8
  }, {
    x: 1575987818125390,
    y: 0.80,
    name: 'Trace 2',
    unit: 'seconds',
    size: 4
  }, {
    x: 1575987819125390,
    y: 0.83,
    name: 'Trace 3',
    unit: 'seconds',
    size: 4
  }, {
    x: 1575987820125390,
    y: 0.45,
    name: 'Trace 4',
    unit: 'seconds',
    size: 5
  }, {
    x: 1575987821125390,
    y: 0.152,
    name: 'Trace 5',
    unit: 'seconds',
    size: 10
  }],
  legendItem: makeLegend('span duration', 'blue')
};

storiesOf('ChartWithLegend', module)
    .add('as scatter plots with Timestamps', () => {
      return <ChartWithLegend data={[tracesTime]} unit="seconds" xUnit="timestamp" seriesComponent={(<ChartScatter/>)} onClick={dp => alert(`${dp.name}: [${dp.x}, ${dp.y}]`)} />;
    });
