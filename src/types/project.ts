import { Risk } from './risk';
import { HeatmapConfig } from './config';

export interface Project {
  id: string;
  name: string;
  description?: string;
  risks: Risk[];
  config: HeatmapConfig;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}
