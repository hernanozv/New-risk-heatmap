export type ScaleType = 'linear' | 'log';

export interface AxisConfig {
  min: number;
  max: number;
  scale: ScaleType;
  unit?: string;
  divisions: number[];
}

export interface RiskZone {
  id: string;
  name: string;
  color: string;
  bounds: {
    minScore: number;
    maxScore: number;
  };
}

export interface DisplayOptions {
  showGrid: boolean;
  showLabels: boolean;
  showIndicators: boolean;
  showTable: boolean;
  showLegend: boolean;
  lineThickness: number;
}

export interface LabelConfig {
  title: string;
  subtitle?: string;
  xAxisLabel: string;
  yAxisLabel: string;
}

export interface HeatmapConfig {
  axes: {
    x: AxisConfig;
    y: AxisConfig;
  };
  zones: RiskZone[];
  display: DisplayOptions;
  labels: LabelConfig;
}
