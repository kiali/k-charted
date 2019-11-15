import { TimeSeries, Histogram, Datapoint } from '../../../common/types/Metrics';
import { VCLines, LegendInfo, VCLine, LegendItem } from '../types/VictoryChartInfo';
import { filterAndNameMetric, filterAndNameHistogram, LabelsInfo } from '../../../common/utils/timeSeriesUtils';
import { ChartModel } from '../../../common/types/Dashboards';
import { Overlay, VCOverlay } from '../types/Overlay';

export const toVCLine = (dps: Datapoint[], dpInject: { name: string, unit: string, color: string } & any): VCLine => {
  const datapoints = dps
    .map(dp => {
      return {
        x: new Date(dp[0] * 1000) as any,
        y: Number(dp[1]),
        ...dpInject
      };
    })
    .filter(dp => !isNaN(dp.y));
  const legendItem: LegendItem = { name: dpInject.name, symbol: { fill: dpInject.color }};
  return {
    datapoints: datapoints,
    legendItem: legendItem,
    color: dpInject.color
  };
};

let colorsIdx = 0;
const toVCLines = (ts: TimeSeries[], unit: string, colors: string[], title?: string): VCLines => {
  return ts.map(line => {
    const name = title || line.name || '';
    const color = colors[colorsIdx % colors.length];
    colorsIdx++;
    return toVCLine(line.values, { name: name, unit: unit, color: color });
  });
};

const histogramToVCLines = (histogram: Histogram, unit: string, colors: string[]): VCLines => {
  // Flat-map histo_stat * series
  const stats = Object.keys(histogram);
  let allLines: VCLines = [];
  stats.forEach(statName => {
    const lines = toVCLines(histogram[statName], unit, colors);
    allLines = allLines.concat(lines);
  });
  return allLines;
};

const metricsDataSupplier = (chartName: string, metrics: TimeSeries[], labels: LabelsInfo, unit: string, colors: string[]): () => VCLines => {
  return () => {
    colorsIdx = 0;
    const filtered = filterAndNameMetric(chartName, metrics, labels);
    return toVCLines(filtered, unit, colors);
  };
};

const histogramDataSupplier = (histogram: Histogram, labels: LabelsInfo, unit: string, colors: string[]): () => VCLines => {
  return () => {
    colorsIdx = 0;
    const filtered = filterAndNameHistogram(histogram, labels);
    return histogramToVCLines(filtered, unit, colors);
  };
};

export const getDataSupplier = (chart: ChartModel, labels: LabelsInfo, colors: string[]): (() => VCLines) => {
  if (chart.metric) {
    return metricsDataSupplier(chart.name, chart.metric, labels, chart.unit, colors);
  } else if (chart.histogram) {
    return histogramDataSupplier(chart.histogram, labels, chart.unit, colors);
  }
  return () => ([]);
};

export const buildLegendInfo = (series: VCLines, chartWidth: number): LegendInfo => {
  // Very arbitrary rules to try to get a good-looking legend. There's room for enhancement.
  // Box size in pixels per item
  // Note that it is based on longest string in characters, not pixels
  let boxSize = 110;
  const longest = series.map(it => it.legendItem.name).reduce((a, b) => a.length > b.length ? a : b, '').length;
  if (longest >= 30) {
    boxSize = 400;
  } else if (longest >= 20) {
    boxSize = 300;
  } else if (longest >= 10) {
    boxSize = 200;
  }
  const itemsPerRow = Math.max(1, Math.floor(chartWidth / boxSize));
  const nbRows = Math.ceil(series.length / itemsPerRow);

  return {
    height: 15 + 30 * nbRows,
    itemsPerRow: itemsPerRow
  };
};

export const toVCOverlay = (overlay: Overlay): VCOverlay => {
  const dpInject = {
    name: overlay.title,
    unit: overlay.unit,
    color: overlay.color,
    symbol: overlay.symbol,
    size: overlay.size
  };
  const vcLine = toVCLine(overlay.datapoints, dpInject);
  vcLine.legendItem.symbol.type = overlay.symbol;
  return {
    data: vcLine,
    origin: overlay
  };
};
