import vcutils from '../../utils/victoryChartsUtils';
import MetricsChartBase from './MetricsChartBase';
import { VictoryChartInfo } from '../../types/VictoryChartInfo';
import { Histogram, TimeSeries } from '../../types/Metrics';
import { AllPromLabelsValues } from '../../types/Labels';

interface HistogramChartProps {
  histogram: Histogram;
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

  protected getSeriesData(): VictoryChartInfo {
    const filtered: Histogram = {};
    Object.keys(this.props.histogram).forEach(stat => {
      filtered[stat] = this.props.histogram[stat].filter(ts => this.isVisibleMetric(ts.labelSet, this.props.labelValues));
      const statName = stat === 'avg' ? 'average' : 'quantile ' + stat;
      this.nameTimeSeries(filtered[stat], statName);
    });
    return vcutils.histogramToVCLines(filtered);
  }

  nameTimeSeries = (matrix: TimeSeries[], stat: string): TimeSeries[] => {
    matrix.forEach(ts => {
      const labels = Object.keys(ts.labelSet)
        .filter(k => k !== 'reporter')
        .map(k => ts.labelSet[k])
        .join(',');
      if (labels === '') {
        // Ex: average // quantile 0.999 // etc.
        ts.name = stat;
      } else {
        // Ex: policy: average // stadium: quantile 0.999 // etc.
        ts.name = labels + ': ' + stat;
      }
    });
    return matrix;
  };
}

export default HistogramChart;
