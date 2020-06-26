import * as React from 'react';
import { ChartTooltip, ChartTooltipProps } from '@patternfly/react-charts';
import { Flyout, Point, VictoryLabel } from 'victory';

const dy = 15;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const canvasContext: any = document.createElement('canvas').getContext('2d');
// TODO: safe way to get this programmatically?
canvasContext.font = '14px overpass';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomLabel = (props: any & { textWidth: number }) => {
  const nbTexts = Array.isArray(props.text) ? props.text.length : 1;
  const x = props.x - 11 - props.textWidth / 2;
  const startY = 8 + props.y - (nbTexts * dy) / 2;
  return (
    <>
      {props.activePoints && props.activePoints.filter(pt => pt.color)
        .map((pt, idx) => {
          const symbol = pt.symbol || 'square';
          return (
            <Point
              key={'item-' + idx}
              style={{ fill: pt.color, type: symbol }}
              x={x}
              y={startY + dy * idx}
              symbol={symbol}
              size={5.5}
            />
          );
        })
      }
      <VictoryLabel {...props} />
    </>
  );
};

export const CustomTooltip = (props: ChartTooltipProps & { onClick?: (event: MouseEvent) => void }) => {
  const texts: Array<string> = Array.isArray(props.text) ? props.text : [props.text];
  const textWidth = Math.max(...texts.map(t => canvasContext.measureText(t).width));
  return (
    <ChartTooltip
      {...props}
      flyoutWidth={textWidth + 50}
      flyoutComponent={<Flyout style={{ stroke: 'none', fillOpacity: 0.6 }} />}
      labelComponent={<CustomLabel textWidth={textWidth}/>} constrainToVisibleArea={true}
      events={props.onClick ? { onClick: props.onClick } : undefined}
    />
  );
};
