import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

export function ZoomControls() {
  const zoomLevel = useProjectStore(state => state.zoomLevel);
  const panOffset = useProjectStore(state => state.panOffset);
  const zoomIn = useProjectStore(state => state.zoomIn);
  const zoomOut = useProjectStore(state => state.zoomOut);
  const resetZoom = useProjectStore(state => state.resetZoom);

  const zoomPercentage = Math.round(zoomLevel * 100);
  const isPanned = panOffset.x !== 0 || panOffset.y !== 0;

  return (
    <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col gap-2 z-10">
      {/* Zoom In */}
      <Button
        size="sm"
        variant="outline"
        onClick={zoomIn}
        disabled={zoomLevel >= 5}
        title="Acercar (también: doble click en el gráfico)"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>

      {/* Zoom Percentage */}
      <div className="text-xs text-center font-medium text-gray-600 py-1">
        {zoomPercentage}%
      </div>

      {/* Zoom Out */}
      <Button
        size="sm"
        variant="outline"
        onClick={zoomOut}
        disabled={zoomLevel <= 0.5}
        title="Alejar"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>

      {/* Reset Zoom */}
      <Button
        size="sm"
        variant="outline"
        onClick={resetZoom}
        disabled={zoomLevel === 1 && !isPanned}
        title="Restablecer Zoom y Pan"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
}
