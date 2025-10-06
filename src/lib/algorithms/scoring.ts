import { Risk, RiskZone, HeatmapConfig } from '@/types';

/**
 * Calcula el risk score combinando impacto y frecuencia
 */
export function calculateRiskScore(impact: number, frequency: number): number {
  const logImpact = Math.log10(impact);
  const logFrequency = Math.log10(frequency);
  return logImpact + logFrequency;
}

/**
 * Determina la zona de riesgo basándose en el score
 */
export function getRiskZone(risk: Risk, config: HeatmapConfig): RiskZone {
  // Calcular score para el peor escenario
  const worstScore = calculateRiskScore(risk.impact.max, risk.frequency.max);

  // Encontrar zona correspondiente
  for (const zone of config.zones) {
    if (worstScore >= zone.bounds.minScore && worstScore <= zone.bounds.maxScore) {
      return zone;
    }
  }

  // Default: última zona (más crítica)
  return config.zones[config.zones.length - 1];
}

/**
 * Calcula el color de fondo para un punto del heatmap basándose solo en el impacto
 * Rangos:
 * - 0 - 3M: Bajo (verde)
 * - 3 - 32M: Moderado (amarillo)
 * - 32 - 110M: Alto (naranja)
 * - 110M+: Catastrófico (rojo)
 */
export function getBackgroundColorAt(
  impact: number,
  frequency: number,
  zones: RiskZone[]
): string {
  // Ignorar frecuencia, solo usar impacto
  if (impact < 3) {
    // Bajo: 0 - 3M
    return '#10B981'; // Verde
  } else if (impact < 32) {
    // Moderado: 3 - 32M
    return '#FCD34D'; // Amarillo
  } else if (impact < 110) {
    // Alto: 32 - 110M
    return '#FB923C'; // Naranja
  } else {
    // Catastrófico: 110M+
    return '#EF4444'; // Rojo
  }
}
