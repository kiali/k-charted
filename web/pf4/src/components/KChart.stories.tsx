import React from 'react';
import { storiesOf } from '@storybook/react';
import KChart from './KChart';
import { getDataSupplier, toOverlay, toVCDatapoints } from '../utils/victoryChartsUtils';
import { empty, error, generateRandomMetricChart, generateRandomHistogramChart, generateRandomForOverlay, emptyLabels } from '../types/__mocks__/Charts.mock';

import '@patternfly/react-core/dist/styles/base.css';
import { LineInfo } from '../types/VictoryChartInfo';

const metric = generateRandomMetricChart('Random metric chart', ['dogs', 'cats', 'birds'], 12, 'kchart-seed');
const histogram = generateRandomHistogramChart('Random histogram chart', 12, 'kchart-histo-seed');
const colors = ['red', 'green', 'blue'];

const reset = () => {
  metric.chartType = undefined;
  metric.min = undefined;
  metric.max = undefined;
};

const defaultProps = {
  onToggleMaximized: () => { alert('not implemented in this story'); },
  isMaximized: false
};

storiesOf('PF4 KChart', module)
  .add('as lines', () => {
    reset();
    return <KChart {...defaultProps} chart={metric} data={getDataSupplier(metric, emptyLabels, colors)!()} />;
  })
  .add('as areas', () => {
    reset();
    metric.chartType = 'area';
    return <KChart {...defaultProps} chart={metric} data={getDataSupplier(metric, emptyLabels, colors)!()} />;
  })
  .add('as bars', () => {
    reset();
    metric.chartType = 'bar';
    return <KChart {...defaultProps} chart={metric} data={getDataSupplier(metric, emptyLabels, colors)!()} />;
  })
  .add('as scatter', () => {
    reset();
    metric.chartType = 'scatter';
    return <KChart {...defaultProps} chart={metric} data={getDataSupplier(metric, emptyLabels, colors)!()} />;
  })
  .add('with min=20, max=100', () => {
    reset();
    metric.min = 20;
    metric.max = 100;
    return <KChart {...defaultProps} chart={metric} data={getDataSupplier(metric, emptyLabels, colors)!()} />;
  })
  .add('with overlay', () => {
    reset();
    const info = {
      lineInfo: {
        name: 'Span duration',
        unit: 'seconds',
        color: 'pink',
        symbol: 'star',
        size: 15
      },
      dataStyle: { fill: 'pink' }
    };
    const dps = toVCDatapoints(generateRandomForOverlay(), info.lineInfo.name);
    return (
      <KChart
        {...defaultProps}
        chart={metric}
        data={getDataSupplier(metric, emptyLabels, colors)!()}
        overlay={toOverlay(info, dps)}
        onClick={p => alert(p.y as number / ((p as LineInfo).scaleFactor || 1))}
      />
    );
  })
  .add('with bucketed overlay', () => {
    reset();
    const info = {
      lineInfo: {
        name: 'Span duration',
        unit: 'seconds',
        color: 'darkcyan',
        symbol: 'circle',
        size: 15
      },
      dataStyle: { fill: 'darkcyan' },
      buckets: 20
    };
    // Build many datapoints
    const dps = toVCDatapoints(generateRandomForOverlay(), info.lineInfo.name)
      .concat(toVCDatapoints(generateRandomForOverlay(), info.lineInfo.name))
      .concat(toVCDatapoints(generateRandomForOverlay(), info.lineInfo.name))
      .concat(toVCDatapoints(generateRandomForOverlay(), info.lineInfo.name))
      .concat(toVCDatapoints(generateRandomForOverlay(), info.lineInfo.name))
      .concat(toVCDatapoints(generateRandomForOverlay(), info.lineInfo.name))
      .concat(toVCDatapoints(generateRandomForOverlay(), info.lineInfo.name))
      .map(dp => {
        // randomize X a little bit
        return {...dp, x: new Date((dp.x as Date).getTime() + 20000 * (Math.random() - 0.5))};
      });
    return (
      <KChart {...defaultProps} chart={metric} data={getDataSupplier(metric, emptyLabels, colors)!()} overlay={toOverlay(info, dps)} onClick={p => alert('Y: ' + p.y)} />
    );
  })
  .add('histogram', () => (
    <KChart {...defaultProps} chart={histogram} data={getDataSupplier(histogram, emptyLabels, colors)!()} />
  ))
  .add('empty', () => (
    <KChart {...defaultProps} chart={empty} data={getDataSupplier(empty, emptyLabels, colors)!()} />
  ))
  .add('with error', () => (
    <KChart {...defaultProps} chart={error} data={getDataSupplier(empty, emptyLabels, colors)!()} />
  ))
  .add('start collapsed', () => {
    reset();
    const chart = { ...metric, startCollapsed: true };
    return <KChart {...defaultProps} chart={chart} data={getDataSupplier(metric, emptyLabels, colors)!()} />;
  });
