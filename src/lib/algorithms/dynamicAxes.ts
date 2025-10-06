import { Risk } from '@/types';

export interface DynamicAxisRange {
  min: number;
  max: number;
  divisions: number[];
}

/**
 * Calcula el rango óptimo para un eje basándose en los datos
 */
function calculateOptimalRange(values: number[], isLog: boolean = true): DynamicAxisRange {
  if (values.length === 0) {
    return { min: 0.01, max: 100, divisions: [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 100] };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (isLog) {
    // Para escalas logarítmicas
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);

    // Agregar un 15% de margen en escala log (reducido de 20% para menos expansión)
    const margin = (logMax - logMin) * 0.15;
    const rangeMin = Math.max(0.01, Math.pow(10, logMin - margin));
    const rangeMax = Math.pow(10, logMax + margin);

    // Redondear a valores "bonitos"
    const roundedMin = Math.pow(10, Math.floor(Math.log10(rangeMin)));
    const roundedMax = Math.pow(10, Math.ceil(Math.log10(rangeMax)));

    // Generar divisiones
    const divisions = generateLogDivisions(roundedMin, roundedMax);

    return {
      min: roundedMin,
      max: roundedMax,
      divisions,
    };
  } else {
    // Para escalas lineales
    const range = max - min;
    const margin = range * 0.2;
    const rangeMin = Math.max(0, min - margin);
    const rangeMax = max + margin;

    // Redondear a valores "bonitos"
    const step = Math.pow(10, Math.floor(Math.log10(range)));
    const roundedMin = Math.floor(rangeMin / step) * step;
    const roundedMax = Math.ceil(rangeMax / step) * step;

    // Generar divisiones
    const divisions = generateLinearDivisions(roundedMin, roundedMax, 5);

    return {
      min: roundedMin,
      max: roundedMax,
      divisions,
    };
  }
}

/**
 * Genera divisiones logarítmicas óptimas (menos crowded)
 */
function generateLogDivisions(min: number, max: number): number[] {
  const divisions: number[] = [];
  const logMin = Math.floor(Math.log10(min));
  const logMax = Math.ceil(Math.log10(max));

  // Limitar la cantidad de divisiones según el rango
  const range = logMax - logMin;
  let multiplicadores: number[];
  
  if (range <= 2) {
    // Rango pequeño: más divisiones
    multiplicadores = [1, 2, 5];
  } else if (range <= 4) {
    // Rango medio: divisiones moderadas
    multiplicadores = [1, 3];
  } else {
    // Rango grande: solo una división por orden de magnitud
    multiplicadores = [1];
  }

  for (let exp = logMin; exp <= logMax; exp++) {
    const base = Math.pow(10, exp);
    for (const mult of multiplicadores) {
      const value = base * mult;
      if (value >= min && value <= max) {
        divisions.push(value);
      }
    }
  }

  return divisions.sort((a, b) => a - b);
}

/**
 * Genera divisiones lineales
 */
function generateLinearDivisions(min: number, max: number, count: number): number[] {
  const divisions: number[] = [];
  const step = (max - min) / count;

  for (let i = 0; i <= count; i++) {
    divisions.push(min + i * step);
  }

  return divisions;
}

/**
 * Calcula rangos dinámicos para el heatmap basándose en los riesgos
 */
export function calculateDynamicRanges(risks: Risk[]) {
  if (risks.length === 0) {
    // Valores por defecto si no hay riesgos
    return {
      x: {
        min: 0.01,
        max: 50,
        divisions: [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 50],
      },
      y: {
        min: 0.01,
        max: 200,
        divisions: [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 32, 50, 110, 200],
      },
    };
  }

  // Recopilar todos los valores de frecuencia e impacto
  const frequencies: number[] = [];
  const impacts: number[] = [];

  risks.forEach(risk => {
    frequencies.push(risk.frequency.min, risk.frequency.max);
    if (risk.frequency.mean) frequencies.push(risk.frequency.mean);
    if (risk.frequency.p90) frequencies.push(risk.frequency.p90);

    impacts.push(risk.impact.min, risk.impact.max);
    if (risk.impact.mean) impacts.push(risk.impact.mean);
    if (risk.impact.p90) impacts.push(risk.impact.p90);
  });

  // Calcular rangos óptimos
  const xRange = calculateOptimalRange(frequencies, true);
  const yRange = calculateOptimalRange(impacts, true);

  // Para el eje Y (impacto), limitar el máximo para mantener las bandas de color visibles
  // Si el máximo calculado es muy grande, limitarlo a 2x el valor máximo de los riesgos
  const maxImpact = Math.max(...impacts);
  const limitedYMax = Math.min(yRange.max, maxImpact * 2.5);
  
  // Redondear el máximo limitado a un valor "bonito"
  const roundedYMax = Math.pow(10, Math.ceil(Math.log10(limitedYMax)));

  // Asegurar mínimos razonables
  const finalXRange = {
    min: Math.min(xRange.min, 0.01),
    max: Math.max(xRange.max, 50),
    divisions: xRange.divisions,
  };

  // Generar divisiones incluyendo los límites importantes de colores
  const yMin = Math.min(yRange.min, 0.01);
  const yMax = Math.min(roundedYMax, 200);
  let yDivisions = generateLogDivisions(yMin, yMax);
  
  // Asegurar que incluya los límites de bandas de color si están en el rango
  const colorLimits = [3, 32, 110];
  colorLimits.forEach(limit => {
    if (limit >= yMin && limit <= yMax && !yDivisions.includes(limit)) {
      yDivisions.push(limit);
    }
  });
  yDivisions.sort((a, b) => a - b);
  
  // Filtrar divisiones que estén muy cerca de los límites de color importantes
  // para evitar superposición de etiquetas
  yDivisions = yDivisions.filter(div => {
    // Si es un límite de color, siempre mantenerlo
    if (colorLimits.includes(div)) return true;
    
    // Si está muy cerca de un límite de color (menos de 20% de diferencia), eliminarlo
    const tooCloseToColorLimit = colorLimits.some(limit => {
      const ratio = Math.abs(Math.log10(div) - Math.log10(limit)) / Math.abs(Math.log10(yMax) - Math.log10(yMin));
      return ratio < 0.1 && div !== limit;
    });
    
    return !tooCloseToColorLimit;
  });

  const finalYRange = {
    min: yMin,
    max: yMax,
    divisions: yDivisions,
  };

  return {
    x: finalXRange,
    y: finalYRange,
  };
}

/**
 * Aplica zoom a un rango
 */
export function applyZoomToRange(
  range: DynamicAxisRange,
  zoomLevel: number,
  centerValue?: number
): DynamicAxisRange {
  const { min, max } = range;
  const center = centerValue || (min + max) / 2;

  // Calcular nuevo rango con zoom
  const currentRange = max - min;
  const newRange = currentRange / zoomLevel;

  const newMin = Math.max(0.01, center - newRange / 2);
  const newMax = center + newRange / 2;

  // Generar nuevas divisiones para el rango con zoom
  const isLog = max / min > 10; // Heurística para determinar si es log
  const divisions = isLog
    ? generateLogDivisions(newMin, newMax)
    : generateLinearDivisions(newMin, newMax, 5);

  return {
    min: newMin,
    max: newMax,
    divisions,
  };
}
