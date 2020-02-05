import * as React from 'react';
import { ChartTooltip } from '@patternfly/react-charts';
import { Flyout, VictoryLabel } from 'victory';

const squareSize = 10;
const dy = 15;
const canvasContext: any = document.createElement('canvas').getContext('2d');
// TODO: safe way to get this programmatically?
canvasContext.font = '14px overpass';

export const CustomLabel = (props: any & { ignoreColorForPattern?: string }) => {
  const x = props.x - 16 - Math.max(...props.text.map(t => canvasContext.measureText(t).width)) / 2;
  const startY = 3 + props.y - (props.text.length * dy) / 2;
  return (
    <>
      {props.activePoints.filter(pt => pt.color && (!props.ignoreColorForPattern || !(pt.childName && pt.childName.includes(props.ignoreColorForPattern))))
        .map((pt, idx) => {
          return <rect key={'rect-' + idx} width={squareSize} height={squareSize} x={x} y={startY + dy * idx} style={{ fill: pt.color }} />;
        })
      })}
      <VictoryLabel {...props} />
    </>
  );
};

export const CustomFlyout = (props: any) => {
  return <Flyout {...props} width={props.width + 15} style={{ ...props.style, stroke: 'none', fillOpacity: 0.6 }} />;
};

export const CustomTooltip = (props: any) => {
  return <ChartTooltip {...props} flyoutComponent={<CustomFlyout/>} labelComponent={<CustomLabel/>} constrainToVisibleArea={true} />;
};
