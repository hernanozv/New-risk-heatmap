import { useEffect, useState } from 'react';
import { useProjectStore } from './store/projectStore';
import { Heatmap } from './components/Heatmap';
import { RiskModal } from './components/RiskModal';
import { ExportMenu } from './components/ExportMenu';
import { Button } from './components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Risk } from './types';

function App() {
  const loadProjects = useProjectStore(state => state.loadProjects);
  const currentProject = useProjectStore(state => state.currentProject);
  const deleteRisk = useProjectStore(state => state.deleteRisk);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [riskToEdit, setRiskToEdit] = useState<Risk | null>(null);
  const [hoveredRisk, setHoveredRisk] = useState<Risk | null>(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleAddRisk = () => {
    setRiskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditRisk = (risk: Risk) => {
    setRiskToEdit(risk);
    setIsModalOpen(true);
  };

  const handleDeleteRisk = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este riesgo?')) {
      deleteRisk(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRiskToEdit(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Risk Heatmap</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {currentProject ? currentProject.name : 'Cargando...'}
          </div>
          <ExportMenu />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Lista de Riesgos</h3>
            <Button size="sm" onClick={handleAddRisk}>
              <Plus className="w-4 h-4 mr-1" />
              Agregar
            </Button>
          </div>

          <div className="flex-1 overflow-auto space-y-2">
            {currentProject?.risks.map(risk => (
              <div
                key={risk.id}
                className="bg-white p-3 rounded border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                onMouseEnter={() => setHoveredRisk(risk)}
                onMouseLeave={() => setHoveredRisk(null)}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: risk.color }}
                  >
                    {risk.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{risk.name}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      <div>Impacto: {risk.impact.min}-{risk.impact.max}M</div>
                      <div>Frecuencia: {risk.frequency.min}-{risk.frequency.max}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRisk(risk);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRisk(risk.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div id="heatmap-container" className="bg-white h-full">
            <Heatmap 
              highlightedRisk={hoveredRisk}
              onRiskEdit={handleEditRisk}
            />
          </div>
        </main>
      </div>

      {/* Modal de Agregar/Editar Riesgo */}
      <RiskModal open={isModalOpen} onClose={handleCloseModal} riskToEdit={riskToEdit} />
    </div>
  );
}

export default App;
