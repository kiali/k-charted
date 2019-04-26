import * as React from 'react';
import { Chart, ChartGroup, ChartLegend, ChartLine, ChartLineProps, ChartTheme } from '@patternfly/react-charts';
import { ExpandArrowsAltIcon } from '@patternfly/react-icons';
import { VictoryTooltip } from 'victory';
import { VictoryVoronoiContainer } from 'victory-voronoi-container';
// import { format } from 'd3-format';
import { VictoryChartInfo } from '../../types/VictoryChartInfo';
import { LabelSet, AllPromLabelsValues } from '../../types/Labels';

type MetricsChartBaseProps = {
  chartName: string;
  unit: string;
  onExpandRequested?: () => void;
};

const expandBlockStyle: React.CSSProperties = {
  marginBottom: '-1.5em',
  zIndex: 1,
  position: 'relative',
  textAlign: 'right'
};

abstract class MetricsChartBase<Props extends MetricsChartBaseProps> extends React.Component<Props> {
  // private previousColumns: string[] = [];

  protected abstract getControlKey(): string;
  protected abstract getSeriesData(): VictoryChartInfo;

  protected get axisDefinition() {
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
          format: this.formatYAxis
        }
      }
    };
  }

  formatYAxis = (val: number): string => {
    // Round to dismiss float imprecision
    val = Math.round(val * 10000) / 10000;
    switch (this.props.unit) {
      case 'seconds':
        return this.formatSI(val, 's');
      case 'bytes':
      case 'bytes-si':
        return this.formatDataSI(val, 'B');
      case 'bytes-iec':
        return this.formatDataIEC(val, 'B');
      case 'bitrate':
      case 'bitrate-si':
        return this.formatDataSI(val, 'bit/s');
      case 'bitrate-iec':
        return this.formatDataIEC(val, 'bit/s');
      default:
        // Fallback to default SI scaler:
        return this.formatDataSI(val, this.props.unit);
    }
  };

  formatDataSI = (val: number, suffix: string): string => {
    return this.formatData(val, 1000, ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']) + suffix;
  };

  formatDataIEC = (val: number, suffix: string): string => {
    return this.formatData(val, 1024, ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi']) + suffix;
  };

  formatData = (val: number, threshold: number, units: string[]): string => {
    if (Math.abs(val) < threshold) {
      return val + ' ';
    }
    let u = -1;
    do {
      val /= threshold;
      ++u;
    } while (Math.abs(val) >= threshold && u < units.length - 1);
    return val + ' ' + units[u]; //format('~r')(val) + ' ' + units[u];
  };

  formatSI = (val: number, suffix: string): string => {
    const fmt = '' + val; //format('~s')(val);
    let si = '';
    // Insert space before SI
    // "fmt" can be something like:
    // - "9k" => we want "9 kB"
    // - "9" => we want "9 B"
    for (let i = fmt.length - 1; i >= 0; i--) {
      const c = fmt.charAt(i);
      if (c >= '0' && c <= '9') {
        return fmt.substr(0, i + 1) + ' ' + si + suffix;
      }
      si = c + si;
    }
    // Weird: no number found?
    return fmt + suffix;
  };

  protected onExpandHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.onExpandRequested!();
  };

  protected renderExpand = () => {
    return (
      <div style={expandBlockStyle}>
        <a href="#" onClick={this.onExpandHandler}>
          {/* Expand <ExpandArrowsAltIcon name="expand" size="lg" title="Expand" /> */}
          Expand <ExpandArrowsAltIcon />
        </a>
      </div>
    );
  };

  protected isVisibleMetric(metric: LabelSet, labelValues: AllPromLabelsValues) {
    for (const promLabelName in metric) {
      if (metric.hasOwnProperty(promLabelName)) {
        const actualValue = metric[promLabelName];
        const values = labelValues.get(promLabelName);
        if (values && values.hasOwnProperty(actualValue) && !values[actualValue]) {
          return false;
        }
      }
    }
    return true;
  }

  // checkUnload(data: C3ChartData) {
  //   const newColumns = data.columns.map(c => c[0] as string);
  //   const diff = this.previousColumns.filter(col => !newColumns.includes(col));
  //   if (diff.length > 0) {
  //     data.unload = diff;
  //   }
  //   this.previousColumns = newColumns;
  // }

  render() {
    const data = this.getSeriesData();
    // this.checkUnload(data);
    // const height = 350;
    return (
      <div key={this.getControlKey()} style={{ height: '100%', display: 'flex-inline' }}>
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

export default MetricsChartBase;
