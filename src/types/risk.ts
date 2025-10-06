export type RiskAppetite = 'tolerable' | 'aversion' | 'intolerable';
export type ImpactUnit = 'K' | 'M' | 'B';
export type DisplayLineType = 'min-max' | 'mean-p90';

export interface RiskImpact {
  min: number;
  mean?: number;
  p90?: number;
  max: number;
  unit: ImpactUnit;
}

export interface RiskFrequency {
  min: number;
  mean?: number;
  p90?: number;
  max: number;
}

export interface Risk {
  id: string;
  name: string;
  description?: string;
  impact: RiskImpact;
  frequency: RiskFrequency;
  appetite: RiskAppetite;
  category?: string;
  owner?: string;
  color: string;
  displayLine: DisplayLineType;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}
