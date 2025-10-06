import { Risk, HeatmapConfig } from '@/types';
import { valueToScreen } from './scales';

export interface RiskLinePoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  labelX: number;
  labelY: number;
}

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Calcula los puntos de la línea de riesgo
 */
export function calculateRiskLinePoints(
  risk: Risk,
  config: HeatmapConfig,
  canvasWidth: number,
  canvasHeight: number,
  padding: Padding
): RiskLinePoints {
  const screenXMin = padding.left;
  const screenXMax = canvasWidth - padding.right;
  const screenYMin = padding.top;
  const screenYMax = canvasHeight - padding.bottom;

  // Determinar qué valores usar según configuración
  let impact1: number, impact2: number, freq1: number, freq2: number;

  if (risk.displayLine === 'min-max') {
    impact1 = risk.impact.min;
    impact2 = risk.impact.max;
    freq1 = risk.frequency.min;
    freq2 = risk.frequency.max;
  } else {
    // mean-p90
    impact1 = risk.impact.mean || risk.impact.min;
    impact2 = risk.impact.p90 || risk.impact.max;
    freq1 = risk.frequency.mean || risk.frequency.min;
    freq2 = risk.frequency.p90 || risk.frequency.max;
  }

  // Convertir a coordenadas de pantalla
  const x1 = valueToScreen(
    freq1,
    config.axes.x.min,
    config.axes.x.max,
    screenXMin,
    screenXMax,
    config.axes.x.scale
  );

  // Y invertido (crece hacia abajo en SVG)
  const y1 = valueToScreen(
    impact1,
    config.axes.y.min,
    config.axes.y.max,
    screenYMax,
    screenYMin,
    config.axes.y.scale
  );

  const x2 = valueToScreen(
    freq2,
    config.axes.x.min,
    config.axes.x.max,
    screenXMin,
    screenXMax,
    config.axes.x.scale
  );

  const y2 = valueToScreen(
    impact2,
    config.axes.y.min,
    config.axes.y.max,
    screenYMax,
    screenYMin,
    config.axes.y.scale
  );

  // Posición del label (en el punto superior/más crítico)
  const labelX = x2;
  const labelY = y2;

  return { x1, y1, x2, y2, labelX, labelY };
}

/**
 * Calcula la distancia de un punto a una línea
 */
export function distanceToLine(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx: number, yy: number;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  return Math.sqrt(dx * dx + dy * dy);
}
