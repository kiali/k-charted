export interface LegendInfo {
  height: number;
  itemsPerRow: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Style = any;

export type VCDataPoint = {
  name: string,
  x: number | Date | string,
  y: number,
  style?: Style
};

export type LineInfo = {
  name: string,
  color: string,
  unit?: string,
  symbol?: string,
  size?: number,
  scaleFactor?: number
};

export type RichDataPoint = VCDataPoint & LineInfo;

type BucketDataPoint = {
  name: string,
  start: number | Date,
  end: number | Date,
  x: number | Date,
  y: number[],
  style?: Style
};
export type RichBucketDataPoint = BucketDataPoint & LineInfo;
export type RawOrBucket = RichDataPoint | RichBucketDataPoint;

export type LegendItem = {
  name: string;
  symbol: { fill: string; type?: string };
};

// Create a legend object recognized by Victory. "Type" is optional (default is a square), it refers to a shape ('circle', 'star', etc.)
export const makeLegend = (name: string, color: string, type?: string): LegendItem => {
  return {
    name: name,
    symbol: {
      fill: color,
      type: type
    }
  };
};

export type VCLine = {
  datapoints: RichDataPoint[];
  color?: string;
  legendItem: LegendItem;
};

export type VCLines = VCLine[];
