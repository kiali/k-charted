import { VCLine, LineInfo } from './VictoryChartInfo';

export type OverlayInfo = {
  lineInfo: LineInfo,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataStyle: any, // see "data" in https://formidable.com/open-source/victory/docs/common-props/#style
  buckets?: number
};

export type Overlay = {
  vcLine: VCLine,
  info: OverlayInfo
};
