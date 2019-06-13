import React from 'react';
import { storiesOf } from '@storybook/react';
import KChart from './KChart';
import { getDataSupplier } from '../../utils/victoryChartsUtils';
import { empty, error, generateRandomMetricChart } from '../../types/__mocks__/Charts.mock';

import '@patternfly/react-core/dist/styles/base.css';

const withData = generateRandomMetricChart(['dogs', 'cats', 'birds']);

storiesOf('PF4 KChart', module)
  .add('with data', () => (
    <KChart chart={withData} dataSupplier={getDataSupplier(withData, new Map())!} />
  ))
  .add('empty', () => (
    <KChart chart={empty} dataSupplier={getDataSupplier(empty, new Map())!} />
  ))
  .add('with error', () => (
    <KChart chart={error} dataSupplier={getDataSupplier(empty, new Map())!} />
  ));
