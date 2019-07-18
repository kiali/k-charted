import React from 'react';
import { storiesOf } from '@storybook/react';
import KChart from './KChart';
import { getDataSupplier } from '../utils/victoryChartsUtils';
import { empty, error, generateRandomMetricChart, generateRandomHistogramChart } from '../types/__mocks__/Charts.mock';

import '@patternfly/react-core/dist/styles/base.css';

const metric = generateRandomMetricChart('Random metric chart', ['dogs', 'cats', 'birds'], 12, 'kchart-seed');
const histogram = generateRandomHistogramChart('Random histogram chart', 12, 'kchart-histo-seed');

const reset = () => {
  metric.chartType = undefined;
  metric.min = undefined;
  metric.max = undefined;
};

storiesOf('PF4 KChart', module)
  .add('as lines', () => {
    reset();
    return <KChart chart={metric} dataSupplier={getDataSupplier(metric, new Map())!} />;
  })
  .add('as areas', () => {
    reset();
    metric.chartType = 'area';
    return <KChart chart={metric} dataSupplier={getDataSupplier(metric, new Map())!} />;
  })
  .add('as bars', () => {
    reset();
    metric.chartType = 'bar';
    return <KChart chart={metric} dataSupplier={getDataSupplier(metric, new Map())!} />;
  })
  .add('with min=20, max=100', () => {
    reset();
    metric.min = 20;
    metric.max = 100;
    return <KChart chart={metric} dataSupplier={getDataSupplier(metric, new Map())!} />;
  })
  .add('histogram', () => (
    <KChart chart={histogram} dataSupplier={getDataSupplier(histogram, new Map())!} />
  ))
  .add('empty', () => (
    <KChart chart={empty} dataSupplier={getDataSupplier(empty, new Map())!} />
  ))
  .add('with error', () => (
    <KChart chart={error} dataSupplier={getDataSupplier(empty, new Map())!} />
  ));
