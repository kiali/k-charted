import graphUtils from '../../utils/Graphing';
import { TimeSeries2, AllPromLabelsValues } from '../../types/Metrics';
import MetricsChartBase from './MetricsChartBase';

type MetricChartProps = {
  series: TimeSeries2[];
  chartName: string;
  unit: string;
  labelValues: AllPromLabelsValues;
  onExpandRequested?: () => void;
};

export default class MetricsChart extends MetricsChartBase<MetricChartProps> {
  protected getControlKey(): string {
    if (this.props.series.length === 0) {
      return 'blank';
    }

    const labelNames = Object.keys(this.props.series[0].labelSet);
    if (labelNames.length === 0) {
      return this.props.chartName;
    }

    return this.props.chartName + '-' + labelNames.join('-');
  }

  protected getSeriesData() {
    const filtered = this.props.series.filter(ts => this.isVisibleMetric(ts.labelSet, this.props.labelValues));
    return {
      x: 'x',
      columns: graphUtils.toC3Columns2(this.nameTimeSeries(filtered))
    };
  }
}
