import * as React from 'react';
import { format as d3Format } from 'd3-format';
import { getFormatter } from '../../../common/utils/formatter';
import { ChartVoronoiContainer, ChartTooltip } from '@patternfly/react-charts';

export const createContainer = () => {
  const tooltip = (
    <ChartTooltip
      style={{ stroke: 'none', fill: 'white' }}
      renderInPortal={true}
    />
  );
  return (
    <ChartVoronoiContainer
      labels={dp => `${dp.name}: ${getFormatter(d3Format, dp.unit)(dp.y)}`}
      labelComponent={tooltip}
    />
  );
};
