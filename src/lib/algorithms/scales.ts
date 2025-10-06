import { scaleLog, scaleLinear } from 'd3-scale';
import { ScaleType } from '@/types';

/**
 * Convierte un valor a coordenada de pantalla
 */
export function valueToScreen(
  value: number,
  min: number,
  max: number,
  screenMin: number,
  screenMax: number,
  scale: ScaleType
): number {
  if (scale === 'log') {
    const logScale = scaleLog()
      .domain([min, max])
      .range([screenMin, screenMax])
      .clamp(true);
    return logScale(value);
  } else {
    const linearScale = scaleLinear()
      .domain([min, max])
      .range([screenMin, screenMax])
      .clamp(true);
    return linearScale(value);
  }
}

/**
 * Convierte coordenada de pantalla a valor
 */
export function screenToValue(
  screen: number,
  screenMin: number,
  screenMax: number,
  min: number,
  max: number,
  scale: ScaleType
): number {
  if (scale === 'log') {
    const logScale = scaleLog()
      .domain([min, max])
      .range([screenMin, screenMax])
      .clamp(true);
    return logScale.invert(screen);
  } else {
    const linearScale = scaleLinear()
      .domain([min, max])
      .range([screenMin, screenMax])
      .clamp(true);
    return linearScale.invert(screen);
  }
}

/**
 * Genera divisiones logarítmicas óptimas
 */
export function generateLogDivisions(min: number, max: number): number[] {
  const divisions: number[] = [];
  const logMin = Math.floor(Math.log10(min));
  const logMax = Math.ceil(Math.log10(max));

  for (let exp = logMin; exp <= logMax; exp++) {
    const base = Math.pow(10, exp);
    for (const mult of [1, 2, 3, 5]) {
      const value = base * mult;
      if (value >= min && value <= max) {
        divisions.push(value);
      }
    }
  }

  return divisions.sort((a, b) => a - b);
}

/**
 * Formatea un número para visualización
 */
export function formatNumber(value: number): string {
  if (value >= 1000) {
    return (value / 1000).toFixed(0) + 'k';
  } else if (value >= 100) {
    return value.toFixed(0);
  } else if (value >= 10) {
    return value.toFixed(0);
  } else if (value >= 1) {
    return value.toFixed(1);
  } else if (value >= 0.1) {
    return value.toFixed(1);
  } else {
    return value.toFixed(2);
  }
}

/**
 * Formatea impacto con unidad
 */
export function formatImpact(value: number, unit: string): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k${unit}`;
  } else if (value >= 100) {
    return `${value.toFixed(0)}${unit}`;
  } else if (value >= 10) {
    return `${value.toFixed(0)}${unit}`;
  } else if (value >= 1) {
    return `${value.toFixed(1)}${unit}`;
  } else if (value >= 0.1) {
    return `${value.toFixed(1)}${unit}`;
  } else {
    return `${value.toFixed(2)}${unit}`;
  }
}
