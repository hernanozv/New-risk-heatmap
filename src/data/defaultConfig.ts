import { HeatmapConfig } from '@/types';

export const DEFAULT_CONFIG: HeatmapConfig = {
  axes: {
    x: {
      min: 0.01,
      max: 50,
      scale: 'log',
      unit: 'eventos/año',
      divisions: [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 50],
    },
    y: {
      min: 0.01,
      max: 200,
      scale: 'log',
      unit: 'M',
      divisions: [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 32, 50, 110, 200],
    },
  },
  zones: [
    {
      id: 'low',
      name: 'Bajo',
      color: '#10B981',
      bounds: { minScore: -10, maxScore: 0 },
    },
    {
      id: 'medium',
      name: 'Medio',
      color: '#FCD34D',
      bounds: { minScore: 0, maxScore: 1 },
    },
    {
      id: 'high',
      name: 'Alto',
      color: '#FB923C',
      bounds: { minScore: 1, maxScore: 2 },
    },
    {
      id: 'critical',
      name: 'Crítico',
      color: '#EF4444',
      bounds: { minScore: 2, maxScore: 10 },
    },
  ],
  display: {
    showGrid: true,
    showLabels: true,
    showIndicators: false,
    showTable: true,
    showLegend: true,
    lineThickness: 3,
  },
  labels: {
    title: 'Risk Heatmap (POC)',
    subtitle: 'RISK & COMPLIANCE',
    xAxisLabel: 'FRECUENCIA ANUAL',
    yAxisLabel: 'IMPACTO ECONÓMICO',
  },
};
