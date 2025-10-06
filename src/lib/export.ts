import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Project } from '@/types';

/**
 * Exporta el heatmap como imagen PNG
 */
export async function exportAsPNG(elementId: string, filename: string = 'risk-heatmap.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2, // Alta resolución
    backgroundColor: '#ffffff',
    logging: false,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Exporta el heatmap como PDF
 */
export async function exportAsPDF(elementId: string, filename: string = 'risk-heatmap.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Calcular dimensiones manteniendo aspecto
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const width = imgWidth * ratio;
  const height = imgHeight * ratio;

  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  pdf.save(filename);
}

/**
 * Exporta los datos del proyecto como Excel
 */
export function exportAsExcel(project: Project, filename: string = 'risk-data.xlsx') {
  const workbook = XLSX.utils.book_new();

  // Hoja 1: Datos de riesgos
  const risksData = project.risks.map(risk => ({
    ID: risk.id,
    Riesgo: risk.name,
    Descripcion: risk.description || '',
    'Impacto Minimo': risk.impact.min,
    'Impacto Maximo': risk.impact.max,
    'Unidad Impacto': risk.impact.unit,
    'Frecuencia Minima': risk.frequency.min,
    'Frecuencia Maxima': risk.frequency.max,
    Apetito: risk.appetite === 'intolerable' ? 'Intolerante' : risk.appetite === 'aversion' ? 'Averso' : 'Tolerante',
    Categoria: risk.category || '',
    Responsable: risk.owner || '',
  }));

  const ws1 = XLSX.utils.json_to_sheet(risksData);
  XLSX.utils.book_append_sheet(workbook, ws1, 'Riesgos');

  // Hoja 2: Configuración del heatmap
  const configData = [
    { Parametro: 'Titulo', Valor: project.config.labels.title },
    { Parametro: 'Subtitulo', Valor: project.config.labels.subtitle || '' },
    { Parametro: 'Eje X - Minimo', Valor: project.config.axes.x.min },
    { Parametro: 'Eje X - Maximo', Valor: project.config.axes.x.max },
    { Parametro: 'Eje X - Escala', Valor: project.config.axes.x.scale },
    { Parametro: 'Eje Y - Minimo', Valor: project.config.axes.y.min },
    { Parametro: 'Eje Y - Maximo', Valor: project.config.axes.y.max },
    { Parametro: 'Eje Y - Escala', Valor: project.config.axes.y.scale },
    { Parametro: 'Eje Y - Unidad', Valor: project.config.axes.y.unit || '' },
  ];

  const ws2 = XLSX.utils.json_to_sheet(configData);
  XLSX.utils.book_append_sheet(workbook, ws2, 'Configuracion');

  // Hoja 3: Estadísticas
  const statsData = project.risks.map(risk => {
    const avgImpact = (risk.impact.min + risk.impact.max) / 2;
    const avgFrequency = (risk.frequency.min + risk.frequency.max) / 2;
    const riskScore = Math.log10(avgImpact) + Math.log10(avgFrequency);

    return {
      ID: risk.id,
      Riesgo: risk.name,
      'Impacto Promedio': avgImpact.toFixed(2),
      'Frecuencia Promedio': avgFrequency.toFixed(2),
      'Risk Score': riskScore.toFixed(2),
    };
  });

  const ws3 = XLSX.utils.json_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, ws3, 'Estadisticas');

  XLSX.writeFile(workbook, filename);
}

/**
 * Exporta solo los datos en formato JSON
 */
export function exportAsJSON(project: Project, filename: string = 'risk-project.json') {
  const dataStr = JSON.stringify(project, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}
