import * as React from 'react';
import { Chart, ChartGroup, ChartLegend, ChartLine, ChartLineProps, ChartTheme } from '@patternfly/react-charts';
import { ExpandArrowsAltIcon } from '@patternfly/react-icons';
import { VictoryTooltip } from 'victory';
import { VictoryVoronoiContainer } from 'victory-voronoi-container';

import { ChartModel } from '../../types/Dashboards';
import { VictoryChartInfo } from '../../types/VictoryChartInfo';

type KChartProps = {
  chart: ChartModel;
  onExpandRequested?: () => void;
  dataSupplier: () => VictoryChartInfo;
};

const expandBlockStyle: React.CSSProperties = {
  marginBottom: '-1.5em',
  zIndex: 1,
  position: 'relative',
  textAlign: 'right'
};

class KChart extends React.Component<KChartProps> {
  onExpandHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.onExpandRequested!();
  };

  renderExpand = () => {
    return (
      <div style={expandBlockStyle}>
        <a href="#" onClick={this.onExpandHandler}>
          Expand <ExpandArrowsAltIcon />
        </a>
      </div>
    );
  };

  render() {
    const data = this.props.dataSupplier();
    return (
      <div key={this.props.chart.name} style={{ height: '100%', display: 'flex-inline' }}>
        {this.props.onExpandRequested && this.renderExpand()}
        <div style={{ width: 450, height: 360 }}>
          <div>
            <Chart theme={ChartTheme.light.multi} name={this.props.chart.name}
              containerComponent={
                <VictoryVoronoiContainer voronoiDimension="x"
                  labels={(d: ChartLineProps) => d.name + ': ' + d.y}
                  labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{fill: "white"}}/>}
                />
              }>
              <ChartGroup>
                {data.series.map(line => {
                  return (
                    <ChartLine data={line} />
                  );
                })}
              </ChartGroup>
            </Chart>
          </div>
          <div className="chart-legend">
            <ChartLegend
              data={data.legend}
              title={this.props.chart.name}
              height={50}
              theme={ChartTheme.light.multi}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default KChart;
