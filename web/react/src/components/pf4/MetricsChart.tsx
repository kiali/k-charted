import vcutils from '../../utils/victoryChartsUtils';
import { TimeSeries } from '../../types/Metrics';
import MetricsChartBase from './MetricsChartBase';
import { VictoryChartInfo } from '../../types/VictoryChartInfo';
import { AllPromLabelsValues } from '../../types/Labels';

type MetricsChartProps = {
  series: TimeSeries[];
  chartName: string;
  unit: string;
  labelValues: AllPromLabelsValues;
  onExpandRequested?: () => void;
};

export default class MetricsChart extends MetricsChartBase<MetricsChartProps> {
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

  protected getSeriesData(): VictoryChartInfo {
    const filtered = this.props.series.filter(ts => this.isVisibleMetric(ts.labelSet, this.props.labelValues));
    return vcutils.toVCLines(this.nameTimeSeries(filtered));
  }

  nameTimeSeries = (matrix: TimeSeries[]): TimeSeries[] => {
    matrix.forEach(ts => {
      const labels = Object.keys(ts.labelSet)
        .filter(k => k !== 'reporter')
        .map(k => ts.labelSet[k])
        .join(',');
      if (labels === '') {
        // Ex: Request volume (ops)
        ts.name = this.props.chartName;
      } else {
        // Ex: policy // stadium // etc.
        ts.name = labels;
      }
    });
    return matrix;
  };
}
