import * as React from 'react';
import { format as d3Format } from 'd3-format';
import { ChartVoronoiContainer } from '@patternfly/react-charts';
import { getFormatter } from '../../../common/utils/formatter';
import { CustomTooltip } from './CustomTooltip';

import { createContainer } from 'victory';

export const createContainer2 = (
    onBrushCleared?: (domain: any, props: any) => void,
    onBrushDomainChange?: (domain: any, props: any) => void,
    onBrushDomainChangeEnd?: (domain: any, props: any) => void
) => {
  const MyContainer = createContainer('brush', 'voronoi');
  return (
    <MyContainer
      brushDimension={'x'}
      brushDomain={{x: [0, 0]}}
      brushStyle={{stroke: 'transparent', fill: 'blue', fillOpacity: 0.1}}
      defaultBrushArea={'none'}
      onBrushCleared={onBrushCleared}
      onBrushDomainChange={onBrushDomainChange}
      onBrushDomainChangeEnd={onBrushDomainChangeEnd}
      labels={obj => `${obj.datum.name}: ${getFormatter(d3Format, obj.datum.unit)(obj.datum.actualY || obj.datum.y)}`}
      labelComponent={<CustomTooltip/>}
      // We blacklist "parent" as a workaround to avoid the VictoryVoronoiContainer crashing.
      // See https://github.com/FormidableLabs/victory/issues/1355
      voronoiBlacklist={['parent']}
    />
  );
};
