import { useProjectStore } from '@/store/projectStore';
import { Badge } from '@/components/ui/badge';

export function RiskTable() {
  const currentProject = useProjectStore(state => state.currentProject);
  const risks = currentProject?.risks || [];

  if (risks.length === 0) {
    return null;
  }

  return (
    <div className="border-t">
      <div className="p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold bg-yellow-100">R#</th>
              <th className="text-left py-3 px-4 font-semibold bg-yellow-100">Riesgo</th>
              <th className="text-left py-3 px-4 font-semibold bg-yellow-100">Impacto</th>
              <th className="text-left py-3 px-4 font-semibold bg-yellow-100">Frecuencia</th>
              <th className="text-left py-3 px-4 font-semibold bg-yellow-100">Apetito</th>
            </tr>
          </thead>
          <tbody>
            {risks.map(risk => (
              <tr key={risk.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: risk.color }}
                  >
                    {risk.id}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium">{risk.name}</div>
                  {risk.description && (
                    <div className="text-xs text-gray-500 mt-1">{risk.description}</div>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  {risk.impact.min}{risk.impact.unit} - {risk.impact.max}{risk.impact.unit}
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  {risk.frequency.min} - {risk.frequency.max}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      risk.appetite === 'intolerable'
                        ? 'destructive'
                        : risk.appetite === 'aversion'
                        ? 'default'
                        : 'secondary'
                    }
                    className={
                      risk.appetite === 'intolerable'
                        ? 'bg-red-600 hover:bg-red-700'
                        : risk.appetite === 'aversion'
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-green-600 hover:bg-green-700'
                    }
                  >
                    {risk.appetite === 'intolerable'
                      ? 'Intolerante'
                      : risk.appetite === 'aversion'
                      ? 'Averso'
                      : 'Tolerante'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
