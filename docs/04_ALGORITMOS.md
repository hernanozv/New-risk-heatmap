# Algoritmos Clave - Heatmap de Riesgos

## 1. ESCALAS LOGARÍTMICAS

### Conversión Valor → Coordenada de Pantalla

```typescript
function valueToScreen(
  value: number,
  min: number,
  max: number,
  screenMin: number,
  screenMax: number,
  scale: 'linear' | 'log'
): number {
  if (scale === 'log') {
    const logValue = Math.log10(value);
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    const ratio = (logValue - logMin) / (logMax - logMin);
    return screenMin + ratio * (screenMax - screenMin);
  } else {
    const ratio = (value - min) / (max - min);
    return screenMin + ratio * (screenMax - screenMin);
  }
}
```

**Ejemplo**:
```typescript
// Convertir frecuencia 5 eventos/año a posición X en canvas de 800px
const x = valueToScreen(5, 0.1, 50, 0, 800, 'log');
// x ≈ 520px
```

### Conversión Coordenada → Valor

```typescript
function screenToValue(
  screen: number,
  screenMin: number,
  screenMax: number,
  min: number,
  max: number,
  scale: 'linear' | 'log'
): number {
  const ratio = (screen - screenMin) / (screenMax - screenMin);
  
  if (scale === 'log') {
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    const logValue = logMin + ratio * (logMax - logMin);
    return Math.pow(10, logValue);
  } else {
    return min + ratio * (max - min);
  }
}
```

## 2. CÁLCULO DE RISK SCORE

### Formula Básica

```typescript
function calculateRiskScore(impact: number, frequency: number): number {
  // Score = log(Impacto) + log(Frecuencia)
  const logImpact = Math.log10(impact);
  const logFrequency = Math.log10(frequency);
  return logImpact + logFrequency;
}
```

**Ejemplos**:
```typescript
// Riesgo bajo: 1M impacto, 0.1 frecuencia
calculateRiskScore(1, 0.1);  // = 0 + (-1) = -1

// Riesgo alto: 50M impacto, 10 frecuencia
calculateRiskScore(50, 10);  // = 1.7 + 1 = 2.7
```

### Determinación de Zona de Riesgo

```typescript
function getRiskZone(risk: Risk, config: HeatmapConfig): RiskZone {
  // Calcular score para el peor escenario
  const worstScore = calculateRiskScore(
    risk.impact.max,
    risk.frequency.max
  );
  
  // Encontrar zona correspondiente
  for (const zone of config.zones) {
    if (worstScore >= zone.bounds.minScore && 
        worstScore <= zone.bounds.maxScore) {
      return zone;
    }
  }
  
  // Default: última zona (más crítica)
  return config.zones[config.zones.length - 1];
}
```

## 3. RENDERIZADO DE LÍNEA DE RIESGO

### Calcular Puntos de la Línea

```typescript
function calculateRiskLinePoints(
  risk: Risk,
  config: HeatmapConfig,
  canvasWidth: number,
  canvasHeight: number,
  padding: { top: number; right: number; bottom: number; left: number }
): { x1: number; y1: number; x2: number; y2: number } {
  
  const screenXMin = padding.left;
  const screenXMax = canvasWidth - padding.right;
  const screenYMin = padding.top;
  const screenYMax = canvasHeight - padding.bottom;
  
  // Determinar qué valores usar según configuración
  let impact1, impact2, freq1, freq2;
  
  if (risk.displayLine === 'min-max') {
    impact1 = risk.impact.min;
    impact2 = risk.impact.max;
    freq1 = risk.frequency.min;
    freq2 = risk.frequency.max;
  } else { // mean-p90
    impact1 = risk.impact.mean || risk.impact.min;
    impact2 = risk.impact.p90 || risk.impact.max;
    freq1 = risk.frequency.mean || risk.frequency.min;
    freq2 = risk.frequency.p90 || risk.frequency.max;
  }
  
  // Convertir a coordenadas de pantalla
  const x1 = valueToScreen(
    freq1, config.axes.x.min, config.axes.x.max,
    screenXMin, screenXMax, config.axes.x.scale
  );
  
  const y1 = valueToScreen(
    impact1, config.axes.y.min, config.axes.y.max,
    screenYMax, screenYMin, config.axes.y.scale  // Invertido (Y crece hacia abajo)
  );
  
  const x2 = valueToScreen(
    freq2, config.axes.x.min, config.axes.x.max,
    screenXMin, screenXMax, config.axes.x.scale
  );
  
  const y2 = valueToScreen(
    impact2, config.axes.y.min, config.axes.y.max,
    screenYMax, screenYMin, config.axes.y.scale
  );
  
  return { x1, y1, x2, y2 };
}
```

## 4. GENERACIÓN DE MATRIZ DE COLORES

### Calcular Color de Fondo en Punto (x, y)

```typescript
function getBackgroundColorAt(
  x: number,
  y: number,
  config: HeatmapConfig,
  canvasWidth: number,
  canvasHeight: number,
  padding: { top: number; right: number; bottom: number; left: number }
): string {
  
  // Convertir coordenadas de pantalla a valores
  const frequency = screenToValue(
    x, padding.left, canvasWidth - padding.right,
    config.axes.x.min, config.axes.x.max, config.axes.x.scale
  );
  
  const impact = screenToValue(
    y, canvasHeight - padding.bottom, padding.top,
    config.axes.y.min, config.axes.y.max, config.axes.y.scale
  );
  
  // Calcular score
  const score = calculateRiskScore(impact, frequency);
  
  // Determinar zona
  for (const zone of config.zones) {
    if (score >= zone.bounds.minScore && score <= zone.bounds.maxScore) {
      return zone.color;
    }
  }
  
  return config.zones[0].color; // Default: primera zona
}
```

### Renderizar Matriz como Grid de Rectángulos

```typescript
function renderColorMatrix(
  svg: SVGElement,
  config: HeatmapConfig,
  width: number,
  height: number,
  padding: any
): void {
  
  const cellSize = 20; // px
  const cols = Math.floor((width - padding.left - padding.right) / cellSize);
  const rows = Math.floor((height - padding.top - padding.bottom) / cellSize);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = padding.left + col * cellSize;
      const y = padding.top + row * cellSize;
      
      const color = getBackgroundColorAt(
        x + cellSize / 2,
        y + cellSize / 2,
        config, width, height, padding
      );
      
      // Crear rectángulo SVG
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', cellSize.toString());
      rect.setAttribute('height', cellSize.toString());
      rect.setAttribute('fill', color);
      rect.setAttribute('opacity', '0.6');
      
      svg.appendChild(rect);
    }
  }
}
```

## 5. DETECCIÓN DE HOVER

### Distancia de Punto a Línea

```typescript
function distanceToLine(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
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
  
  let xx, yy;
  
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
```

### Detectar Riesgo bajo el Mouse

```typescript
function getRiskAtPoint(
  mouseX: number,
  mouseY: number,
  risks: Risk[],
  config: HeatmapConfig,
  canvasWidth: number,
  canvasHeight: number,
  padding: any,
  threshold: number = 10 // px
): Risk | null {
  
  for (const risk of risks) {
    const points = calculateRiskLinePoints(
      risk, config, canvasWidth, canvasHeight, padding
    );
    
    const distance = distanceToLine(
      mouseX, mouseY,
      points.x1, points.y1,
      points.x2, points.y2
    );
    
    if (distance <= threshold) {
      return risk;
    }
  }
  
  return null;
}
```

## 6. GENERACIÓN DE EJES

### Calcular Divisiones Logarítmicas Óptimas

```typescript
function generateLogDivisions(min: number, max: number): number[] {
  const divisions: number[] = [];
  const logMin = Math.floor(Math.log10(min));
  const logMax = Math.ceil(Math.log10(max));
  
  for (let exp = logMin; exp <= logMax; exp++) {
    const base = Math.pow(10, exp);
    
    // Agregar valores: 1x, 2x, 3x, 5x por década
    for (const mult of [1, 2, 3, 5]) {
      const value = base * mult;
      if (value >= min && value <= max) {
        divisions.push(value);
      }
    }
  }
  
  return divisions.sort((a, b) => a - b);
}
```

**Ejemplo**:
```typescript
generateLogDivisions(0.1, 50);
// [0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5, 10, 20, 30, 50]
```

## 7. FORMATEO DE NÚMEROS

### Formatear Impacto

```typescript
function formatImpact(value: number, unit: 'K' | 'M' | 'B'): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}${unit}`;
  }
  return `${value}${unit}`;
}
```

### Formatear Frecuencia

```typescript
function formatFrequency(value: number): string {
  if (value >= 1) {
    return value.toFixed(0);
  } else if (value >= 0.1) {
    return value.toFixed(1);
  } else {
    return value.toFixed(2);
  }
}
```
