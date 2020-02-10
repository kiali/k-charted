import * as React from 'react';
import { ChartTooltip } from '@patternfly/react-charts';
import { Flyout, VictoryLabel } from 'victory';

const squareSize = 10;
const dy = 15;
const canvasContext: any = document.createElement('canvas').getContext('2d');
// TODO: safe way to get this programmatically?
canvasContext.font = '14px overpass';

export const CustomLabel = (props: any & { textWidth: number }) => {
  const nbTexts = Array.isArray(props.text) ? props.text.length : 1;
  const x = props.x - 16 - props.textWidth / 2;
  const startY = 3 + props.y - (nbTexts * dy) / 2;
  return (
    <>
      {props.activePoints && props.activePoints.filter(pt => pt.color)
        .map((pt, idx) => {
          return <rect key={'rect-' + idx} width={squareSize} height={squareSize} x={x} y={startY + dy * idx} style={{ fill: pt.color }} />;
        })
      })}
      <VictoryLabel {...props} />
    </>
  );
};

export const CustomTooltip = (props: any) => {
  const texts: Array<string> = Array.isArray(props.text) ? props.text : [props.text];
  const textWidth = Math.max(...texts.map(t => canvasContext.measureText(t).width));
  return (
    <ChartTooltip
      {...props}
      flyoutWidth={textWidth + 50}
      flyoutComponent={<Flyout style={{ stroke: 'none', fillOpacity: 0.6 }} />}
      labelComponent={<CustomLabel textWidth={textWidth}/>} constrainToVisibleArea={true}
    />
  );
};
