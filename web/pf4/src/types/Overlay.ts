import { Datapoint } from '../../../common/types/Metrics';
import { VCLine } from './VictoryChartInfo';

export type Overlay = {
  datapoints: Datapoint[],
  title: string,
  unit: string,
  dataStyle: any, // see "data" in https://formidable.com/open-source/victory/docs/common-props/#style
  color: string,
  symbol: string,
  size: number
};

export type VCOverlay = {
  data: VCLine,
  origin: Overlay
};
