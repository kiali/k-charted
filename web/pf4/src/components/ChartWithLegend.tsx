import * as React from 'react';
import { Chart, ChartGroup, ChartAxis, ChartScatter, ChartProps } from '@patternfly/react-charts';
import { VictoryLegend, VictoryPortal, VictoryLabel } from 'victory';
import { format as d3Format } from 'd3-format';

import { getFormatter } from '../../../common/utils/formatter';
import { VCLines } from '../types/VictoryChartInfo';
import { VCOverlay } from '../types/Overlay';
import { createContainer } from './Container';
import { buildLegendInfo } from '../utils/victoryChartsUtils';

type Props = {
  data: VCLines;
  seriesComponent: any;
  unit: string;
  chartHeight?: number;
  groupOffset?: number;
  fill?: boolean;
  stroke?: boolean;
  moreChartProps?: ChartProps;
  overlay?: VCOverlay;
};

type State = {
  width: number;
  hiddenSeries: Set<number>;
};

class ChartWithLegend extends React.Component<Props, State> {
  containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.containerRef = React.createRef<HTMLDivElement>();
    this.state = { width: 0, hiddenSeries: new Set() };
  }

  handleResize = () => {
    if (this.containerRef && this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const scaleInfo = this.scaledAxisInfo(this.props.data);
    const groupOffset = this.props.groupOffset || 0;

    const dataWithOverlay = this.props.overlay ? this.props.data.concat(this.props.overlay.data) : this.props.data;
    const overlayIdx = this.props.data.length;
    const legend = buildLegendInfo(dataWithOverlay, this.state.width);
    const height = 300 + legend.height;
    const padding = { top: 10, bottom: 20, left: 40, right: 10 };
    padding.bottom += legend.height;

    const events = this.props.data.map((_, idx) => this.registerEvents(idx, 'serie-' + idx));
    if (this.props.overlay) {
      events.push(this.registerEvents(overlayIdx, 'overlay'));
    }

    return (
      <div ref={this.containerRef}>
        <Chart
          height={height}
          width={this.state.width}
          padding={padding}
          events={events}
          containerComponent={createContainer()}
          scale={{x: 'time'}}
          {...this.props.moreChartProps}
        >
          <ChartGroup offset={groupOffset}>
            {this.props.data.map((serie, idx) => {
              if (this.state.hiddenSeries.has(idx)) {
                return undefined;
              }
              return React.cloneElement(this.props.seriesComponent, {
                key: 'serie-' + idx,
                name: 'serie-' + idx,
                data: serie.datapoints,
                style: { data: { fill: this.props.fill ? serie.color : undefined, stroke: this.props.stroke ? serie.color : undefined }}
              });
            })}
          </ChartGroup>
          {this.props.overlay && !this.state.hiddenSeries.has(overlayIdx) && (
            <ChartScatter key="overlay" name="overlay" data={this.props.overlay.data.datapoints} style={{ data: this.props.overlay.origin.dataStyle }} />
          )}
          <ChartAxis
            tickCount={scaleInfo.count}
            style={{ tickLabels: {fontSize: 12, padding: 2} }}
          />
          <ChartAxis
            tickLabelComponent={<VictoryPortal><VictoryLabel/></VictoryPortal>}
            dependentAxis={true}
            tickFormat={getFormatter(d3Format, this.props.unit)}
            style={{ tickLabels: {fontSize: 12, padding: 2} }}
          />
          <VictoryLegend
            name={'serie-legend'}
            data={dataWithOverlay.map((s, idx) => {
              if (this.state.hiddenSeries.has(idx)) {
                return { ...s.legendItem, symbol: { fill: '#72767b' } };
              }
              return s.legendItem;
            })}
            x={50}
            y={height - legend.height}
            height={legend.height}
            width={this.state.width}
            itemsPerRow={legend.itemsPerRow}
          />
        </Chart>
      </div>
    );
  }

  private registerEvents(idx: number, serieName: string) {
    return {
      childName: ['serie-legend'],
      target: ['data', 'labels'],
      eventKey: String(idx),
      eventHandlers: {
        onMouseOver: () => {
          return [
            {
              childName: [serieName],
              target: 'data',
              eventKey: 'all',
              mutation: props => {
                return {
                  style: {...props.style,  strokeWidth: 4, fillOpacity: 0.5}
                };
              }
            }
          ];
        },
        onMouseOut: () => {
          return [
            {
              childName: [serieName],
              target: 'data',
              eventKey: 'all',
              mutation: () => {
                return null;
              }
            }
          ];
        },
        onClick: () => {
          return [
            {
              childName: [serieName],
              target: 'data',
              mutation: () => {
                if (!this.state.hiddenSeries.delete(idx)) {
                  // Was not already hidden => add to set
                  this.state.hiddenSeries.add(idx);
                }
                this.setState({ hiddenSeries: new Set(this.state.hiddenSeries) });
                return null;
              }
            },
            {
              childName: [serieName],
              target: 'data',
              eventKey: 'all',
              mutation: () => null
            }
          ];
        }
      },
    };
  }

  private scaledAxisInfo(data: VCLines) {
    const ticks = Math.max(...(data.map(s => s.datapoints.length)));
    if (this.state.width < 500) {
      return {
        count: Math.min(5, ticks),
        format: '%H:%M'
      };
    } else if (this.state.width < 700) {
      return {
        count: Math.min(10, ticks),
        format: '%H:%M'
      };
    }
    return {
      count: Math.min(15, ticks),
      format: '%H:%M:%S'
    };
  }
}

export default ChartWithLegend;
