import { DashboardModel } from '../../../../common/types/Dashboards';
import seedrandom from 'seedrandom';
import { generateRandomMetricChart, generateRandomHistogramChart } from './Charts.mock';

export const generateRandomDashboard = (title: string, seed?: string): DashboardModel => {
  if (seed) {
    seedrandom(seed, { global: true });
  }
  return {
    title: title,
    charts: [
      generateRandomMetricChart('Best animal', ['dogs', 'cats', 'birds'], 4),
      generateRandomMetricChart('Best fruit', ['apples', 'oranges', 'bananas'], 4),
      generateRandomHistogramChart('Animal histogram', 4),
      generateRandomMetricChart('Best animal++', ['dogs', 'cats', 'birds', 'stunning animal with very very long name that you\'ve never about', 'mermaids', 'escherichia coli', 'wohlfahrtiimonas', 'Chuck Norris'], 6),
      generateRandomMetricChart('Best fruit++', ['apples', 'oranges', 'bananas', 'peaches', 'peers', 'cherries', 'leetchies', 'pineapple'], 6),
    ],
    aggregations: []
  };
};

export const emptyDashboard: DashboardModel = {
  title: 'Empty dashboard',
  charts: [],
  aggregations: []
};
