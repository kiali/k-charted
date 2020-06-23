import * as React from 'react';
import { style } from 'typestyle';
import { Button, EmptyState, EmptyStateIcon, EmptyStateBody, Expandable } from '@patternfly/react-core';
import { ChartArea, ChartBar, ChartScatter, ChartLine } from '@patternfly/react-charts';
import { CubesIcon, ExpandArrowsAltIcon, ErrorCircleOIcon } from '@patternfly/react-icons';

import { ChartModel } from '../../../common/types/Dashboards';
import { VCLines, VCDataPoint } from '../types/VictoryChartInfo';
import { Overlay } from '../types/Overlay';
import ChartWithLegend from './ChartWithLegend';
import { BrushHandlers } from './Container';

type KChartProps = {
  chart: ChartModel;
  data: VCLines;
  expandHandler?: () => void;
  onClick?: (datum: VCDataPoint) => void;
  brushHandlers?: BrushHandlers;
  overlay?: Overlay;
  timeWindow?: [Date, Date];
};

const expandBlockStyle: React.CSSProperties = {
  marginBottom: '-1.5em',
  zIndex: 1,
  position: 'relative',
  textAlign: 'right'
};

const noMetricsStyle = style({
  width: '100%',
  textAlign: 'center',
  $nest: {
    '& > p': {
      font: '14px sans-serif',
      margin: 0,
      padding: 32,
      paddingTop: 20
    }
  }
});

type State = {
  collapsed: boolean
};

class KChart extends React.Component<KChartProps, State> {
  constructor(props: KChartProps) {
    super(props);
    this.state = {
      collapsed: this.props.chart.startCollapsed || (!this.props.chart.error && this.isEmpty(this.props.data))
    };
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
    return (
      <Expandable
        toggleText={this.props.chart.name}
        onToggle={() => {
          this.setState({ collapsed: !this.state.collapsed });
        }}
        isExpanded={!this.state.collapsed}
      >
        {this.props.chart.error ? this.renderError()
          : (this.isEmpty(this.props.data) ? this.renderEmpty()
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
    );
  }

  private isEmpty(data: VCLines): boolean {
    return !data.some(s => s.datapoints.length !== 0);
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
