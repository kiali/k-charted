import * as React from 'react';
import { Chart, ChartGroup, ChartLegend, ChartLine, ChartLineProps, ChartTheme } from '@patternfly/react-charts';
import { ExpandArrowsAltIcon } from '@patternfly/react-icons';
import { VictoryTooltip } from 'victory';
import { VictoryVoronoiContainer } from 'victory-voronoi-container';

import { VictoryChartInfo } from '../../types/VictoryChartInfo';

type KChartProps = {
  chartName: string;
  unit: string;
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
  // private previousColumns: string[] = [];

  // get axisDefinition() {
  //   return {
  //     x: {
  //       type: 'timeseries',
  //       tick: {
  //         fit: true,
  //         count: 15,
  //         multiline: false,
  //         format: '%H:%M:%S'
  //       }
  //     },
  //     y: {
  //       tick: {
  //         format: getFormatter(this.props.unit)
  //       }
  //     }
  //   };
  // }

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

  // checkUnload(data: C3ChartData) {
  //   const newColumns = data.columns.map(c => c[0] as string);
  //   const diff = this.previousColumns.filter(col => !newColumns.includes(col));
  //   if (diff.length > 0) {
  //     data.unload = diff;
  //   }
  //   this.previousColumns = newColumns;
  // }

  render() {
    const data = this.props.dataSupplier();
    // this.checkUnload(data);
    // const height = 350;
    return (
      <div key={this.props.chartName} style={{ height: '100%', display: 'flex-inline' }}>
        {this.props.onExpandRequested && this.renderExpand()}
        <div style={{ width: 450, height: 360 }}>
          <div>
            <Chart theme={ChartTheme.light.multi} name={this.props.chartName}
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
              title={this.props.chartName}
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
