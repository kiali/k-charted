import * as React from 'react';
import { Button, EmptyState, EmptyStateIcon, EmptyStateBody, Expandable } from '@patternfly/react-core';
import { ChartArea, ChartBar, ChartScatter, ChartLine } from '@patternfly/react-charts';
import { CubesIcon, AngleDoubleLeftIcon, ExpandArrowsAltIcon, ErrorCircleOIcon } from '@patternfly/react-icons';

import { ChartModel } from '../../../common/types/Dashboards';
import { VCLines, RawOrBucket, RichDataPoint, LineInfo } from '../types/VictoryChartInfo';
import { Overlay } from '../types/Overlay';
import ChartWithLegend from './ChartWithLegend';
import { BrushHandlers } from './Container';

type KChartProps<T extends LineInfo> = {
  chart: ChartModel;
  data: VCLines<RichDataPoint>;
  isMaximized: boolean;
  onToggleMaximized: () => void;
  onClick?: (datum: RawOrBucket<T>) => void;
  brushHandlers?: BrushHandlers;
  overlay?: Overlay<T>;
  timeWindow?: [Date, Date];
};

export const maximizeButtonStyle: React.CSSProperties = {
  marginBottom: '-3.5em',
  marginRight: '0.8em',
  top: '-2.7em',
  zIndex: 1,
  position: 'relative',
  float: 'right'
};

type State = {
  collapsed: boolean
};

class KChart<T extends LineInfo> extends React.Component<KChartProps<T>, State> {
  constructor(props: KChartProps<T>) {
    super(props);
    this.state = {
      collapsed: this.props.chart.startCollapsed || (!this.props.chart.error && this.isEmpty())
    };
  }

  render() {
    return (
      <Expandable
        toggleText={this.props.chart.name}
        onToggle={() => {
          this.setState({ collapsed: !this.state.collapsed });
        }}
        isExpanded={!this.state.collapsed}
      >
        {this.props.chart.error ? this.renderError()
          : (this.isEmpty() ? this.renderEmpty()
          : this.renderChart())}
      </Expandable>
    );
  }

  renderChart() {
    if (this.state.collapsed) {
      return undefined;
    }
    let fill = false;
    let stroke = true;
    let seriesComponent = (<ChartLine/>);
    if (this.props.chart.chartType === 'area') {
      fill = true;
      stroke = false;
      seriesComponent = (<ChartArea/>);
    } else if (this.props.chart.chartType === 'bar') {
      fill = true;
      stroke = false;
      seriesComponent = (<ChartBar/>);
    } else if (this.props.chart.chartType === 'scatter') {
      fill = true;
      stroke = false;
      seriesComponent = (<ChartScatter/>);
    }

    const groupOffset = this.props.chart.chartType === 'bar' ? 7 : 0;
    const minDomain = this.props.chart.min === undefined ? undefined : { y: this.props.chart.min };
    const maxDomain = this.props.chart.max === undefined ? undefined : { y: this.props.chart.max };

    return (
      <>
        {this.props.onToggleMaximized && (
          <div style={maximizeButtonStyle}>
            <Button variant="secondary" onClick={this.props.onToggleMaximized}>
              {this.props.isMaximized ? <AngleDoubleLeftIcon /> : <ExpandArrowsAltIcon />}
            </Button>
          </div>
        )}
        <ChartWithLegend
          data={this.props.data}
          seriesComponent={seriesComponent}
          fill={fill}
          stroke={stroke}
          groupOffset={groupOffset}
          overlay={this.props.overlay}
          unit={this.props.chart.unit}
          moreChartProps={{ minDomain: minDomain, maxDomain: maxDomain }}
          onClick={this.props.onClick}
          brushHandlers={this.props.brushHandlers}
          timeWindow={this.props.timeWindow}
        />
      </>
    );
  }

  private isEmpty(): boolean {
    return !this.props.data.some(s => s.datapoints.length !== 0);
  }

  private renderEmpty() {
    return (
      <EmptyState>
        <EmptyStateIcon icon={CubesIcon} />
        <EmptyStateBody>No data available</EmptyStateBody>
      </EmptyState>
    );
  }

  private renderError() {
    return (
      <EmptyState>
        <EmptyStateIcon icon={() => (
          <ErrorCircleOIcon style={{color: '#cc0000'}} width={32} height={32} />
        )} />
        <EmptyStateBody>
          An error occured while fetching this metric:
          <p><i>{this.props.chart.error}</i></p>
        </EmptyStateBody>
      </EmptyState>
    );
  }
}

export default KChart;
