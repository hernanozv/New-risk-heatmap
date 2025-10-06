import { Risk } from '@/types';

interface HeatmapTooltipProps {
  risk: Risk | null;
  x: number;
  y: number;
  visible: boolean;
}

export function HeatmapTooltip({ risk, x, y, visible }: HeatmapTooltipProps) {
  if (!visible || !risk) return null;

  // Calcular posición ajustada para evitar salirse de la ventana
  const tooltipWidth = 300; // ancho aproximado del tooltip
  const tooltipHeight = 200; // alto aproximado del tooltip
  const offset = 10;
  
  let adjustedX = x + offset;
  let adjustedY = y - tooltipHeight / 2; // centrar verticalmente con el punto

  // Evitar que se salga por la derecha
  if (adjustedX + tooltipWidth > window.innerWidth) {
    adjustedX = x - tooltipWidth - offset; // colocar a la izquierda
  }

  // Evitar que se salga por arriba
  if (adjustedY < 0) {
    adjustedY = offset;
  }

  // Evitar que se salga por abajo
  if (adjustedY + tooltipHeight > window.innerHeight) {
    adjustedY = window.innerHeight - tooltipHeight - offset;
  }

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
      }}
    >
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm max-w-xs"
           style={{ minWidth: '250px' }}>
        <div className="font-bold mb-1 flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: risk.color }}
          >
            {risk.id}
          </div>
          <span>{risk.name}</span>
        </div>
        {risk.description && (
          <div className="text-gray-300 text-xs mb-2 border-b border-gray-700 pb-2">
            {risk.description}
          </div>
        )}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Impacto:</span>
            <span className="font-medium">
              {risk.impact.min}{risk.impact.unit} - {risk.impact.max}{risk.impact.unit}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Frecuencia:</span>
            <span className="font-medium">
              {risk.frequency.min} - {risk.frequency.max} eventos/año
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Apetito:</span>
            <span
              className={`font-medium ${
                risk.appetite === 'intolerable'
                  ? 'text-red-400'
                  : risk.appetite === 'aversion'
                  ? 'text-orange-400'
                  : 'text-green-400'
              }`}
            >
              {risk.appetite === 'intolerable'
                ? 'Intolerante'
                : risk.appetite === 'aversion'
                ? 'Averso'
                : 'Tolerante'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
