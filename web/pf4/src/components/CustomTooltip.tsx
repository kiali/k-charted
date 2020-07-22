import * as React from 'react';
import { ChartTooltip, ChartTooltipProps } from '@patternfly/react-charts';
import { Flyout, Point, VictoryLabel } from 'victory';
import { VCDataPoint } from '..';

const dy = 15;
const headSize = 2 * dy;
const yMargin = 8;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const canvasContext: any = document.createElement('canvas').getContext('2d');
// TODO: safe way to get this programmatically?
canvasContext.font = '14px overpass';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomLabel = (props: any & { head?: string, text: string[], textWidth: number }) => {
  const x = props.x - 11 - props.textWidth / 2;
  const textsWithHead = props.head ? [props.head, ' '].concat(props.text) : props.text;
  const headSize = props.head ? 2 * dy : 0;
  const startY = yMargin + props.y - (textsWithHead.length * dy) / 2 + headSize;
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
      <VictoryLabel {...props} text={textsWithHead} />
    </>
  );
};

const getHeader = (activePoints?: VCDataPoint[]): string | undefined => {
  if (activePoints && activePoints.length > 0) {
    const x = activePoints[0].x;
    if (typeof x === 'object') {
      // Assume date
      return x.toLocaleTimeString();
    }
  }
  return undefined;
}

export const CustomTooltip = (props: ChartTooltipProps & { showTime?: boolean, activePoints?: VCDataPoint[], onClick?: (event: MouseEvent) => void }) => {
  const head = props.showTime ? getHeader(props.activePoints) : undefined;
  let height = props.text.length * dy + 2 * yMargin;
  if (head) {
    height += headSize;
  }
  const texts = Array.isArray(props.text) ? props.text : [props.text]
  const textWidth = Math.max(...texts.map(t => canvasContext.measureText(t).width));
  const width = 50 + (head ? Math.max(textWidth, canvasContext.measureText(head).width) : textWidth);
  return (
    <ChartTooltip
      {...props}
      text={texts}
      flyoutWidth={width}
      flyoutHeight={height}
      flyoutComponent={<Flyout style={{ stroke: 'none', fillOpacity: 0.6 }} />}
      labelComponent={<CustomLabel head={head} textWidth={textWidth}/>} constrainToVisibleArea={true}
      events={props.onClick ? { onClick: props.onClick } : undefined}
    />
  );
};
