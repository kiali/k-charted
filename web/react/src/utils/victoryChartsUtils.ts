import { ChartLineProps } from '@patternfly/react-charts';
import { TimeSeries, Histogram } from '../types/Metrics';
import { VictoryChartInfo, VictoryChartLegendItem } from '../types/VictoryChartInfo';

export default {
  histogramToVCLines(histogram: Histogram): VictoryChartInfo {
    // Flat-map histo_stat * series
    const stats = Object.keys(histogram);
    let series: ChartLineProps[][] = [];
    let legend: VictoryChartLegendItem[] = [];
    stats.forEach(statName => {
      const innerInfo = this.toVCLines(histogram[statName]);
      series = series.concat(innerInfo.series);
      legend = legend.concat(innerInfo.legend);
    });
    return {
      legend: legend,
      series: series
    };
  },

  toVCLines(ts: TimeSeries[]): VictoryChartInfo {
    return {
      legend: ts.map(line => ({ name: line.name! })),
      series: ts.map(line => {
        return line.values.map(dp => {
          return {
            name: line.name!,
            x: dp[0] * 1000,
            y: dp[1]
          };
        });
      })
    };
  }
};
