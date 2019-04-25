import { Histogram2, AllPromLabelsValues } from '../../types/Metrics';
import graphUtils from '../../utils/Graphing';
import MetricsChartBase from './MetricsChartBase';

interface HistogramChartProps {
  histogram: Histogram2;
  chartName: string;
  unit: string;
  labelValues: AllPromLabelsValues;
  onExpandRequested?: () => void;
}

class HistogramChart extends MetricsChartBase<HistogramChartProps> {
  protected getControlKey() {
    const keys = Object.keys(this.props.histogram);
    if (keys.length === 0 || this.props.histogram[keys[0]].length === 0) {
      return 'blank';
    }

    const labelNames = Object.keys(this.props.histogram[keys[0]][0].labelSet);
    if (labelNames.length === 0) {
      return this.props.chartName;
    }

    return this.props.chartName + '-' + labelNames.join('-');
  }

  protected getSeriesData() {
    const filtered: Histogram2 = {};
    Object.keys(this.props.histogram).forEach(stat => {
      filtered[stat] = this.props.histogram[stat].filter(ts => this.isVisibleMetric(ts.labelSet, this.props.labelValues));
      const statName = stat === 'avg' ? 'average' : 'quantile ' + stat;
      this.nameTimeSeries(filtered[stat], statName);
    });
    return {
      x: 'x',
      columns: graphUtils.histogramToC3Columns(filtered)
    };
  }
}

export default HistogramChart;
