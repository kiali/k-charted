import React from 'react';
import { storiesOf } from '@storybook/react';
import KChart from './KChart';
import { getDataSupplier } from '../../utils/c3ChartsUtils';
import { empty, error, generateRandomMetricChart } from '../../types/__mocks__/Charts.mock';

import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import 'patternfly-react/dist/css/patternfly-react.css';

const withData = generateRandomMetricChart(['dogs', 'cats', 'birds']);

storiesOf('PF3 KChart', module)
  .add('with data', () => (
    <KChart chart={withData} dataSupplier={getDataSupplier(withData, new Map())!} />
  ))
  .add('empty', () => (
    <KChart chart={empty} dataSupplier={getDataSupplier(empty, new Map())!} />
  ))
  .add('with error', () => (
    <KChart chart={error} dataSupplier={getDataSupplier(empty, new Map())!} />
  ));
