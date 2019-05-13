import React from 'react';
import { storiesOf } from '@storybook/react';
import KChart from './KChart';
import { getDataSupplier } from '../../utils/c3ChartsUtils';
import { empty, generateRandomMetricChart } from '../../types/__mocks__/Charts.mock';

import 'patternfly/dist/css/patternfly.css';
import 'patternfly-react/dist/css/patternfly-react.css';

const withData = generateRandomMetricChart(['a', 'b', 'c']);

storiesOf('PF3 KChart', module)
  .add('empty', () => (
    <KChart chart={empty} dataSupplier={getDataSupplier(empty, new Map())!} />
  ))
  .add('with data', () => (
    <KChart chart={withData} dataSupplier={getDataSupplier(withData, new Map())!} />
  ));
