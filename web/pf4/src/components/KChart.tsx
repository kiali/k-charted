import * as React from 'react';
import { style } from 'typestyle';
import { Button, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Chart, ChartArea, ChartBar, ChartLine, ChartGroup, ChartThemeColor, ChartAxis } from '@patternfly/react-charts';
import { ExpandArrowsAltIcon, InfoAltIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import { VictoryLegend, VictoryPortal, VictoryLabel } from 'victory';
import { format as d3Format } from 'd3-format';

import { ChartModel } from '../../../common/types/Dashboards';
import { getFormatter } from '../../../common/utils/formatter';
import { VCLines, VCLine } from '../types/VictoryChartInfo';
import { createContainer } from './Container';
import { buildLegendInfo } from '../utils/victoryChartsUtils';

type KChartProps = {
  chart: ChartModel;
  data: VCLines;
  chartHeight?: number;
  expandHandler?: () => void;
};

type State = {
  width: number;
  hiddenSeries: Set<number>;
};

const expandBlockStyle: React.CSSProperties = {
  marginBottom: '-1.5em',
  zIndex: 1,
  position: 'relative',
  textAlign: 'right'
};

const emptyMetricsStyle = style({
  width: '100%',
  height: 345,
  textAlign: 'center',
  $nest: {
    '& > p': {
      font: '14px sans-serif',
      margin: 0
    },
    '& div': {
      width: '100%',
      height: 'calc(100% - 5ex)',
      backgroundColor: '#fafafa',
      border: '1px solid #d1d1d1'
    },
    '& div p:first-child': {
      marginTop: '8ex'
    }
  }
});

class KChart extends React.Component<KChartProps, State> {
  containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: KChartProps) {
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

  onExpandHandler = () => {
    this.props.expandHandler!();
  }

  renderExpand = () => {
    return (
      <div style={expandBlockStyle}>
        <Button onClick={this.onExpandHandler}>
          Expand <ExpandArrowsAltIcon />
        </Button>
      </div>
    );
  }

  render() {
    if (this.props.chart.error) {
      return this.renderError();
    } else if (this.isEmpty(this.props.data)) {
      return this.renderEmpty();
    }

    const scaleInfo = this.scaledAxisInfo(this.props.data);
    const seriesBuilder =
      (this.props.chart.chartType === 'area') ? (serie: VCLine, idx) => (<ChartArea key={'serie-' + idx} name={'serie-' + idx} data={serie.datapoints} />) :
      (this.props.chart.chartType === 'bar')  ? (serie: VCLine, idx) => (<ChartBar key={'serie-' + idx} name={'serie-' + idx} data={serie.datapoints} />) :
                                                (serie: VCLine, idx) => (<ChartLine key={'serie-' + idx} name={'serie-' + idx} data={serie.datapoints} />);
    const groupOffset = this.props.chart.chartType === 'bar' ? 7 : 0;
    const minDomain = this.props.chart.min === undefined ? undefined : { y: this.props.chart.min };
    const maxDomain = this.props.chart.max === undefined ? undefined : { y: this.props.chart.max };

    const legend = buildLegendInfo(this.props.data, this.state.width);
    const height = 300 + legend.height;
    const padding = { top: 10, bottom: 20, left: 40, right: 10 };
    padding.bottom += legend.height;

    const events = this.props.data.map((_, idx) => {
      return {
        childName: ['serie-legend'],
        target: ['data', 'labels'],
        eventKey: String(idx),
        eventHandlers: {
          onMouseOver: () => {
            return [
              {
                childName: ['serie-' + idx],
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
                childName: ['serie-' + idx],
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
                childName: ['serie-' + idx],
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
                childName: ['serie-' + idx],
                target: 'data',
                eventKey: 'all',
                mutation: () => null
              }
            ];
          }
        },
      };
    });

    return (
      <div ref={this.containerRef}>
        <TextContent>
          <Text component={TextVariants.h4} style={{textAlign: 'center'}}>{this.props.chart.name}</Text>
        </TextContent>
        <Chart
          height={height}
          width={this.state.width}
          padding={padding}
          events={events}
          containerComponent={createContainer()}
          themeColor={ChartThemeColor.multi}
          scale={{x: 'time'}}
          minDomain={minDomain}
          maxDomain={maxDomain}>
          <ChartGroup offset={groupOffset}>
            {this.props.data.map((serie, idx) => {
              if (this.state.hiddenSeries.has(idx)) {
                return undefined;
              }
              return seriesBuilder(serie, idx);
            })}
          </ChartGroup>
          <ChartAxis
            tickCount={scaleInfo.count}
            style={{ tickLabels: {fontSize: 12, padding: 2} }}
          />
          <ChartAxis
            tickLabelComponent={<VictoryPortal><VictoryLabel/></VictoryPortal>}
            dependentAxis={true}
            tickFormat={getFormatter(d3Format, this.props.chart.unit)}
            style={{ tickLabels: {fontSize: 12, padding: 2} }}
          />
          <VictoryLegend
            name={'serie-legend'}
            data={this.props.data.map((s, idx) => {
              if (this.state.hiddenSeries.has(idx)) {
                return { ...s.legendItem, symbol: { fill: '#72767b' } };
              }
              return s.legendItem;
            })}
            x={50}
            y={height - legend.height}
            height={legend.height}
            themeColor={ChartThemeColor.multi}
            width={this.state.width}
            itemsPerRow={legend.itemsPerRow}
          />
        </Chart>
      </div>
    );
  }

  private isEmpty(data: VCLines): boolean {
    return !data.some(s => s.datapoints.length !== 0);
  }

  private renderEmpty() {
    return (
      <div className={emptyMetricsStyle}>
        <p>{this.props.chart.name}</p>
        <div>
          <p>
            <InfoAltIcon />
          </p>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  private renderError() {
    return (
      <div className={emptyMetricsStyle}>
        <p>{this.props.chart.name}</p>
        <div>
          <p>
            <ErrorCircleOIcon style={{color: '#cc0000'}} />
          </p>
          <p>An error occured while fetching this metric:</p>
          <p><i>{this.props.chart.error}</i></p>
          <p>Please make sure the dashboard definition is correct.</p>
        </div>
      </div>
    );
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

export default KChart;
