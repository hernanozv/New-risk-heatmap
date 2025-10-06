import { useMemo, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { calculateRiskLinePoints, type Padding, distanceToLine } from '@/lib/algorithms/rendering';
import { valueToScreen, formatImpact, formatNumber } from '@/lib/algorithms/scales';
import { getBackgroundColorAt } from '@/lib/algorithms/scoring';
import { calculateDynamicRanges } from '@/lib/algorithms/dynamicAxes';
import { HeatmapTooltip } from './HeatmapTooltip';
import { ZoomControls } from './ZoomControls';
import { Risk } from '@/types';

const PADDING: Padding = {
  top: 40,
  right: 40,
  bottom: 120,
  left: 80,
};

interface HeatmapProps {
  highlightedRisk?: Risk | null;
  onRiskEdit?: (risk: Risk) => void;
}

export function Heatmap({ highlightedRisk, onRiskEdit }: HeatmapProps) {
  const currentProject = useProjectStore(state => state.currentProject);
  const zoomLevel = useProjectStore(state => state.zoomLevel);
  const panOffset = useProjectStore(state => state.panOffset);
  const setZoomLevel = useProjectStore(state => state.setZoomLevel);
  const setPanOffset = useProjectStore(state => state.setPanOffset);

  const { risks, config } = currentProject || { risks: [], config: null };

  const [hoveredRisk, setHoveredRisk] = useState<Risk | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tooltipFromHover, setTooltipFromHover] = useState(false);

  // Usar highlightedRisk de la prop si está disponible
  const activeRisk = highlightedRisk || hoveredRisk;

  // Dimensiones del canvas
  const width = 900;
  const height = 600;

  const screenXMin = PADDING.left;
  const screenXMax = width - PADDING.right;
  const screenYMin = PADDING.top;
  const screenYMax = height - PADDING.bottom;

  // Calcular rangos dinámicos (siempre activos)
  const effectiveConfig = useMemo(() => {
    if (!config) return null;

    // Siempre usar ejes dinámicos si hay riesgos
    if (risks.length > 0) {
      const dynamicRanges = calculateDynamicRanges(risks);

      // Calcular el rango ajustado con pan y zoom
      const xRange = (dynamicRanges.x.max - dynamicRanges.x.min) / zoomLevel;
      const yRange = (dynamicRanges.y.max - dynamicRanges.y.min) / zoomLevel;

      const xCenter = (dynamicRanges.x.min + dynamicRanges.x.max) / 2;
      const yCenter = (dynamicRanges.y.min + dynamicRanges.y.max) / 2;

      // Limitar el pan para que no se aleje demasiado (máximo 2x el rango original)
      const maxPanX = (dynamicRanges.x.max - dynamicRanges.x.min) * 2;
      const maxPanY = (dynamicRanges.y.max - dynamicRanges.y.min) * 2;
      const limitedPanX = Math.max(-maxPanX, Math.min(panOffset.x, maxPanX));
      const limitedPanY = Math.max(-maxPanY, Math.min(panOffset.y, maxPanY));

      const xMin = xCenter - xRange / 2 + limitedPanX;
      const xMax = xCenter + xRange / 2 + limitedPanX;
      const yMin = yCenter - yRange / 2 + limitedPanY;
      const yMax = yCenter + yRange / 2 + limitedPanY;

      return {
        ...config,
        axes: {
          x: {
            ...config.axes.x,
            min: Math.max(0.001, xMin),
            max: xMax,
            divisions: dynamicRanges.x.divisions,
          },
          y: {
            ...config.axes.y,
            min: Math.max(0.001, yMin),
            max: yMax,
            divisions: dynamicRanges.y.divisions,
          },
        },
      };
    }

    // Si no hay riesgos, usar configuración por defecto
    return config;
  }, [config, risks, zoomLevel, panOffset]);

  // Calcular puntos de las líneas de riesgo
  const riskLines = useMemo(() => {
    if (!effectiveConfig) return [];
    return risks.map(risk => ({
      risk,
      points: calculateRiskLinePoints(risk, effectiveConfig, width, height, PADDING),
    }));
  }, [risks, effectiveConfig, width, height]);

  // Generar matriz de colores de fondo
  const colorGrid = useMemo(() => {
    if (!effectiveConfig) return [];
    const cellSize = 40;
    const cols = Math.floor((screenXMax - screenXMin) / cellSize);
    const rows = Math.floor((screenYMax - screenYMin) / cellSize);
    const cells = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = screenXMin + col * cellSize;
        const y = screenYMin + row * cellSize;

        // Cálculo manual explícito para escala logarítmica
        // Para X (frecuencia)
        const xNormalized = (x - screenXMin) / (screenXMax - screenXMin);
        const logFreqMin = Math.log10(effectiveConfig.axes.x.min);
        const logFreqMax = Math.log10(effectiveConfig.axes.x.max);
        const freq = Math.pow(10, logFreqMin + xNormalized * (logFreqMax - logFreqMin));
        
        // Para Y (impacto) - INVERTIDO porque Y crece hacia abajo en SVG
        const yNormalized = (y - screenYMin) / (screenYMax - screenYMin);
        const logImpactMin = Math.log10(effectiveConfig.axes.y.min);
        const logImpactMax = Math.log10(effectiveConfig.axes.y.max);
        // yNormalized = 0 (arriba) debería dar max, yNormalized = 1 (abajo) debería dar min
        const impact = Math.pow(10, logImpactMax - yNormalized * (logImpactMax - logImpactMin));

        const color = getBackgroundColorAt(impact, freq, effectiveConfig.zones);

        cells.push({ x, y, width: cellSize, height: cellSize, color });
      }
    }

    return cells;
  }, [effectiveConfig, screenXMin, screenXMax, screenYMin, screenYMax]);

  // Deshabilitar zoom con scroll
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    // Solo prevenir el scroll de la página
    e.stopPropagation();
  };

  // Manejar inicio de arrastre
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Solo iniciar drag con botón izquierdo
    if (e.button !== 0) return;
    
    // No iniciar drag si estamos sobre una línea de riesgo
    if (hoveredRisk) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.currentTarget.style.cursor = 'grabbing';
  };

  // Manejar arrastre
  const handleMouseDrag = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !effectiveConfig) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Convertir píxeles a unidades del gráfico
    const xRange = effectiveConfig.axes.x.max - effectiveConfig.axes.x.min;
    const yRange = effectiveConfig.axes.y.max - effectiveConfig.axes.y.min;

    const screenWidth = screenXMax - screenXMin;
    const screenHeight = screenYMax - screenYMin;

    // Convertir delta de píxeles a unidades del gráfico (log scale)
    // Factor más pequeño (0.15) para movimiento más suave
    const xDelta = -(deltaX / screenWidth) * xRange * 0.15;
    const yDelta = (deltaY / screenHeight) * yRange * 0.15;

    setPanOffset({
      x: panOffset.x + xDelta,
      y: panOffset.y + yDelta,
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Finalizar arrastre
  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.style.cursor = 'default';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!effectiveConfig) return;

    // Si estamos arrastrando, manejar el drag
    if (isDragging) {
      handleMouseDrag(e);
      return;
    }

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Buscar riesgo bajo el mouse
    let foundRisk: Risk | null = null;
    const threshold = 15; // píxeles

    for (const { risk, points } of riskLines) {
      const distance = distanceToLine(
        mouseX,
        mouseY,
        points.x1,
        points.y1,
        points.x2,
        points.y2
      );

      if (distance <= threshold) {
        foundRisk = risk;
        break;
      }
    }

    if (foundRisk) {
      setHoveredRisk(foundRisk);
      setTooltipPos({ x: e.clientX, y: e.clientY });
      setTooltipFromHover(true);
      svg.style.cursor = 'pointer';
    } else {
      setHoveredRisk(null);
      setTooltipFromHover(false);
      svg.style.cursor = isDragging ? 'grabbing' : 'grab';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<SVGSVGElement>) => {
    setHoveredRisk(null);
    setTooltipFromHover(false);
    setIsDragging(false);
    e.currentTarget.style.cursor = 'default';
  };

  // Manejar doble click: editar riesgo si está sobre uno, sino hacer zoom
  const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!effectiveConfig) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // PRIMERO: Verificar si hay un riesgo bajo el cursor
    if (onRiskEdit) {
      let foundRisk: Risk | null = null;
      const threshold = 15; // píxeles

      for (const { risk, points } of riskLines) {
        const distance = distanceToLine(
          mouseX,
          mouseY,
          points.x1,
          points.y1,
          points.x2,
          points.y2
        );

        if (distance <= threshold) {
          foundRisk = risk;
          break;
        }
      }

      // Si encontramos un riesgo, abrir el modal de edición
      if (foundRisk) {
        onRiskEdit(foundRisk);
        return; // Salir sin hacer zoom
      }
    }

    // SEGUNDO: Si no hay riesgo, hacer zoom centrado en el cursor
    const zoomFactor = 1.5;
    const newZoom = Math.min(zoomLevel * zoomFactor, 5);
    
    if (newZoom === zoomLevel) return; // Ya está en zoom máximo

    // Calcular qué punto del gráfico está bajo el cursor
    // Normalizar posición del mouse en el canvas (0 a 1)
    const mouseXNorm = (mouseX - screenXMin) / (screenXMax - screenXMin);
    const mouseYNorm = (mouseY - screenYMin) / (screenYMax - screenYMin);

    // Calcular el rango actual del gráfico
    const currentXRange = effectiveConfig.axes.x.max - effectiveConfig.axes.x.min;
    const currentYRange = effectiveConfig.axes.y.max - effectiveConfig.axes.y.min;

    // Ajustar el pan para mantener el punto bajo el cursor en la misma posición
    // Al hacer zoom, el rango se reduce, así que necesitamos mover el centro
    const xRangeDelta = currentXRange * (1 - 1 / zoomFactor);
    const yRangeDelta = currentYRange * (1 - 1 / zoomFactor);

    const newPanX = panOffset.x + xRangeDelta * (mouseXNorm - 0.5);
    const newPanY = panOffset.y + yRangeDelta * (mouseYNorm - 0.5);

    // Aplicar el nuevo zoom y pan
    setZoomLevel(newZoom);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  if (!effectiveConfig) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No hay proyecto activo</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-sm font-medium text-gray-500">{effectiveConfig.labels.subtitle}</h2>
        <h1 className="text-2xl font-bold">{effectiveConfig.labels.title}</h1>
      </div>

      {/* SVG Canvas */}
      <div className="flex items-center justify-center p-6 relative">
        <div className="absolute top-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
          💡 Doble click: editar riesgo o zoom • Arrastra para mover
        </div>
        <svg
          id="heatmap-svg"
          width={width}
          height={height}
          className="border border-gray-200 bg-white"
          style={{ maxWidth: '100%', height: 'auto', cursor: 'grab' }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
        >
          {/* Matriz de colores de fondo */}
          <g opacity="0.4">
            {colorGrid.map((cell, i) => (
              <rect
                key={i}
                x={cell.x}
                y={cell.y}
                width={cell.width}
                height={cell.height}
                fill={cell.color}
              />
            ))}
          </g>

          {/* Grid */}
          {effectiveConfig.display.showGrid && (
            <g stroke="#e5e7eb" strokeWidth="0.5">
              {/* Líneas verticales */}
              {effectiveConfig.axes.x.divisions.map((val, i) => {
                const x = valueToScreen(
                  val,
                  effectiveConfig.axes.x.min,
                  effectiveConfig.axes.x.max,
                  screenXMin,
                  screenXMax,
                  effectiveConfig.axes.x.scale
                );
                return <line key={`vline-${i}`} x1={x} y1={screenYMin} x2={x} y2={screenYMax} />;
              })}
              {/* Líneas horizontales */}
              {effectiveConfig.axes.y.divisions.map((val, i) => {
                const y = valueToScreen(
                  val,
                  effectiveConfig.axes.y.min,
                  effectiveConfig.axes.y.max,
                  screenYMax,
                  screenYMin,
                  effectiveConfig.axes.y.scale
                );
                return <line key={`hline-${i}`} x1={screenXMin} y1={y} x2={screenXMax} y2={y} />;
              })}
            </g>
          )}

          {/* Ejes */}
          <g>
            {/* Eje X */}
            <line
              x1={screenXMin}
              y1={screenYMax}
              x2={screenXMax}
              y2={screenYMax}
              stroke="#374151"
              strokeWidth="2"
            />
            {/* Labels eje X */}
            {effectiveConfig.axes.x.divisions.map((val, i) => {
              const x = valueToScreen(
                val,
                effectiveConfig.axes.x.min,
                effectiveConfig.axes.x.max,
                screenXMin,
                screenXMax,
                effectiveConfig.axes.x.scale
              );
              return (
                <text
                  key={`xlabel-${i}`}
                  x={x}
                  y={screenYMax + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#374151"
                >
                  {formatNumber(val)}
                </text>
              );
            })}
            {/* Título eje X */}
            <text
              x={(screenXMin + screenXMax) / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="#374151"
            >
              {effectiveConfig.labels.xAxisLabel}
            </text>

            {/* Eje Y */}
            <line
              x1={screenXMin}
              y1={screenYMin}
              x2={screenXMin}
              y2={screenYMax}
              stroke="#374151"
              strokeWidth="2"
            />
            {/* Labels eje Y */}
            {effectiveConfig.axes.y.divisions.map((val, i) => {
              const y = valueToScreen(
                val,
                effectiveConfig.axes.y.min,
                effectiveConfig.axes.y.max,
                screenYMax,
                screenYMin,
                effectiveConfig.axes.y.scale
              );
              return (
                <text
                  key={`ylabel-${i}`}
                  x={screenXMin - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fontWeight="500"
                  fill="#374151"
                >
                  {formatImpact(val, effectiveConfig.axes.y.unit || '')}
                </text>
              );
            })}
            {/* Título eje Y */}
            <text
              x={20}
              y={(screenYMin + screenYMax) / 2}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="#374151"
              transform={`rotate(-90, 20, ${(screenYMin + screenYMax) / 2})`}
            >
              {effectiveConfig.labels.yAxisLabel}
            </text>
          </g>

          {/* Líneas de riesgo */}
          {riskLines.map(({ risk, points }) => {
            const isHovered = activeRisk?.id === risk.id;
            return (
              <g key={risk.id} style={{ cursor: 'pointer' }}>
                {/* Línea */}
                <line
                  x1={points.x1}
                  y1={points.y1}
                  x2={points.x2}
                  y2={points.y2}
                  stroke="#000000"
                  strokeWidth={isHovered ? effectiveConfig.display.lineThickness + 2 : effectiveConfig.display.lineThickness}
                  strokeLinecap="round"
                  opacity={isHovered ? '1' : '0.8'}
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Punto inferior */}
                <circle
                  cx={points.x1}
                  cy={points.y1}
                  r={isHovered ? '6' : '5'}
                  fill="#000000"
                  opacity={isHovered ? '0.8' : '0.6'}
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Marcador superior con ID */}
                <circle
                  cx={points.labelX}
                  cy={points.labelY}
                  r={isHovered ? '18' : '16'}
                  fill={risk.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ transition: 'all 0.2s' }}
                />
                <text
                  x={points.labelX}
                  y={points.labelY + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#ffffff"
                >
                  {risk.id}
                </text>
              </g>
            );
          })}

          {/* Leyenda - Debajo del gráfico */}
          {effectiveConfig.display.showLegend && (
            <g transform={`translate(${screenXMin}, ${screenYMax + 50})`}>
              <text x="0" y="0" fontSize="11" fontWeight="600" fill="#374151">
                Nivel de Impacto:
              </text>
              
              {/* Verde - Bajo */}
              <rect x="120" y="-10" width="16" height="16" fill="#10B981" rx="2" />
              <text x="140" y="2" fontSize="10" fill="#374151">
                Bajo (0-3M)
              </text>
              
              {/* Amarillo - Moderado */}
              <rect x="240" y="-10" width="16" height="16" fill="#FCD34D" rx="2" />
              <text x="260" y="2" fontSize="10" fill="#374151">
                Moderado (3-32M)
              </text>
              
              {/* Naranja - Alto */}
              <rect x="390" y="-10" width="16" height="16" fill="#FB923C" rx="2" />
              <text x="410" y="2" fontSize="10" fill="#374151">
                Alto (32-110M)
              </text>
              
              {/* Rojo - Catastrófico */}
              <rect x="520" y="-10" width="16" height="16" fill="#EF4444" rx="2" />
              <text x="540" y="2" fontSize="10" fill="#374151">
                Catastrófico (110M+)
              </text>
            </g>
          )}
        </svg>

        {/* Controles de Zoom */}
        <ZoomControls />
      </div>

      {/* Tooltip */}
      {activeRisk && (() => {
        // Si viene del hover en el gráfico, usar posición del mouse
        if (tooltipFromHover) {
          return (
            <HeatmapTooltip
              risk={activeRisk}
              x={tooltipPos.x}
              y={tooltipPos.y}
              visible={true}
            />
          );
        }
        
        // Si viene de highlightedRisk (hover en lista), calcular posición del riesgo
        const riskLine = riskLines.find(rl => rl.risk.id === activeRisk.id);
        if (riskLine) {
          const svgElement = document.querySelector('#heatmap-svg');
          if (svgElement) {
            const rect = svgElement.getBoundingClientRect();
            // Posición del punto final (peor escenario) del riesgo
            // +30 para dejar espacio al círculo y que no se superponga
            const x = rect.left + riskLine.points.x2 + 30;
            const y = rect.top + riskLine.points.y2 + window.scrollY;
            return (
              <HeatmapTooltip
                risk={activeRisk}
                x={x}
                y={y}
                visible={true}
              />
            );
          }
        }
        return null;
      })()}
    </div>
  );
}
