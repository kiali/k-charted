import * as React from 'react';
import { format as d3Format } from 'd3-format';
import { ChartVoronoiContainer } from '@patternfly/react-charts';
import { getFormatter } from '../../../common/utils/formatter';
import { CustomTooltip } from './CustomTooltip';

export const createContainer = () => {
  return (
    <ChartVoronoiContainer
      labels={obj => `${obj.datum.name}: ${getFormatter(d3Format, obj.datum.unit)(obj.datum.actualY || obj.datum.y)}`}
      labelComponent={<CustomTooltip/>}
      // We blacklist "parent" as a workaround to avoid the VictoryVoronoiContainer crashing.
      // See https://github.com/FormidableLabs/victory/issues/1355
      voronoiBlacklist={['parent']}
    />
  );
};
