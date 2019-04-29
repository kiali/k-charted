import * as React from 'react';
import { LineChart, Icon } from 'patternfly-react';

import { getFormatter } from '../../utils/formatter';
import { C3ChartData } from '../../utils/c3ChartsUtils';

type KChartProps = {
  chartName: string;
  unit: string;
  onExpandRequested?: () => void;
  dataSupplier: () => C3ChartData;
};

const expandBlockStyle: React.CSSProperties = {
  marginBottom: '-1.5em',
  zIndex: 1,
  position: 'relative',
  textAlign: 'right'
};

class KChart extends React.Component<KChartProps> {
  private previousColumns: string[] = [];

  get axisDefinition() {
    return {
      x: {
        type: 'timeseries',
        tick: {
          fit: true,
          count: 15,
          multiline: false,
          format: '%H:%M:%S'
        }
      },
      y: {
        tick: {
          format: getFormatter(this.props.unit)
        }
      }
    };
  }

  onExpandHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.onExpandRequested!();
  };

  renderExpand = () => {
    return (
      <div style={expandBlockStyle}>
        <a href="#" onClick={this.onExpandHandler}>
          Expand <Icon name="expand" type="fa" size="lg" title="Expand" />
        </a>
      </div>
    );
  };

  checkUnload(data: C3ChartData) {
    const newColumns = data.columns.map(c => c[0] as string);
    const diff = this.previousColumns.filter(col => !newColumns.includes(col));
    if (diff.length > 0) {
      data.unload = diff;
    }
    this.previousColumns = newColumns;
  }

  render() {
    const data = this.props.dataSupplier();
    this.checkUnload(data);
    const height = 350;
    // Note: if any direct interaction is needed with the C3 chart,
    //  use "oninit" hook and reference "this" as the C3 chart object.
    //  see commented code
    // const self = this;
    return (
      <div key={this.props.chartName} style={{ height: '100%' }}>
        {this.props.onExpandRequested && this.renderExpand()}
        <LineChart
          style={{ height: this.props.onExpandRequested ? height : '99%' }}
          id={this.props.chartName}
          title={{ text: this.props.chartName }}
          data={data}
          axis={this.axisDefinition}
          point={{ show: false }}
          // oninit={function(this: any) {
          //   self.chartRef = this;
          // }}
        />
      </div>
    );
  }
}

export default KChart;
