import * as React from 'react';
import { Icon, LineChart } from 'patternfly-react';

import { getFormatter } from '../../utils/formatter';
import { C3ChartData } from '../../utils/c3ChartsUtils';
import { ChartModel } from '../../types/Dashboards';

type KChartProps = {
  chart: ChartModel;
  expandHandler?: () => void;
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

  onExpandHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.expandHandler!();
  }

  renderExpand = () => {
    return (
      <div style={expandBlockStyle}>
        <a href="#" onClick={this.onExpandHandler}>
          Expand <Icon name="expand" type="fa" size="lg" title="Expand" />
        </a>
      </div>
    );
  }

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
    const self = this;
    return (
      <div key={this.props.chart.name} style={{ height: '100%' }}>
        {this.props.expandHandler && this.renderExpand()}
        <LineChart
          style={{ height: this.props.expandHandler ? height : '99%' }}
          id={this.props.chart.name}
          title={{ text: this.props.chart.name }}
          data={data}
          axis={this.getAxisDefinition()}
          point={{ show: false }}
          onresized={function(this: any) {
            // Hack due to axis definition not being updated on resize
            const scaleInfo = self.scaledAxisInfo();
            this.config.axis_x_tick_count = scaleInfo.count;
            this.config.axis_x_tick_format = scaleInfo.format;
          }}
          // oninit={function(this: any) {
          //   self.chartRef = this;
          // }}
        />
      </div>
    );
  }

  private getAxisDefinition() {
    const scaleInfo = this.scaledAxisInfo();
    return {
      x: {
        type: 'timeseries',
        tick: {
          fit: true,
          count: scaleInfo.count,
          multiline: false,
          format: scaleInfo.format
        }
      },
      y: {
        tick: {
          format: getFormatter(this.props.chart.unit)
        }
      }
    };
  }

  private scaledAxisInfo() {
    if ((window.innerWidth * this.props.chart.spans) / 12 < 450) {
      return {
        count: 5,
        format: '%H:%M'
      };
    } else if ((window.innerWidth * this.props.chart.spans) / 12 < 600) {
      return {
        count: 10,
        format: '%H:%M'
      };
    }
    return {
      count: 15,
      format: '%H:%M:%S'
    };
  }
}

export default KChart;
