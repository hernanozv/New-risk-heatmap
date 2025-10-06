import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileImage, FileText, Table, Code } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { exportAsPNG, exportAsPDF, exportAsExcel, exportAsJSON } from '@/lib/export';

export function ExportMenu() {
  const currentProject = useProjectStore(state => state.currentProject);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPNG = async () => {
    if (!currentProject) return;
    setIsExporting(true);
    try {
      await exportAsPNG('heatmap-container', `${currentProject.name}-heatmap.png`);
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Error al exportar PNG');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!currentProject) return;
    setIsExporting(true);
    try {
      await exportAsPDF('heatmap-container', `${currentProject.name}-heatmap.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al exportar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    if (!currentProject) return;
    try {
      exportAsExcel(currentProject, `${currentProject.name}-data.xlsx`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Error al exportar Excel');
    }
  };

  const handleExportJSON = () => {
    if (!currentProject) return;
    try {
      exportAsJSON(currentProject, `${currentProject.name}-project.json`);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Error al exportar JSON');
    }
  };

  if (!currentProject) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Exportar Visualización</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleExportPNG}>
            <FileImage className="w-4 h-4 mr-2" />
            <span>Imagen PNG</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPDF}>
            <FileText className="w-4 h-4 mr-2" />
            <span>Documento PDF</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Exportar Datos</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleExportExcel}>
            <Table className="w-4 h-4 mr-2" />
            <span>Datos Excel</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportJSON}>
            <Code className="w-4 h-4 mr-2" />
            <span>Proyecto JSON</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
