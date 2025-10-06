# Modelo de Datos - TypeScript

## 1. INTERFACES PRINCIPALES

### Risk (Riesgo)

```typescript
interface Risk {
  // Identificación
  id: string;                    // "R1", "R2", etc.
  name: string;                  // Nombre corto
  description?: string;          // Descripción detallada
  
  // Distribución de Impacto
  impact: {
    min: number;                 // Escenario optimista
    mean?: number;               // Promedio
    p90?: number;                // Percentil 90 (VaR)
    max: number;                 // Peor escenario
    unit: 'K' | 'M' | 'B';      // Miles, Millones, Billones
  };
  
  // Distribución de Frecuencia  
  frequency: {
    min: number;                 // Eventos/año mínimo
    mean?: number;               // Promedio
    p90?: number;                // Percentil 90
    max: number;                 // Máximo
  };
  
  // Clasificación
  appetite: 'tolerable' | 'aversion' | 'intolerable';
  category?: string;             // Ej: "Operacional", "Financiero"
  owner?: string;                // Responsable
  
  // Visualización
  color: string;                 // Hex color
  displayLine: 'min-max' | 'mean-p90';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}
```

### Project (Proyecto)

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  risks: Risk[];
  config: HeatmapConfig;
  createdAt: Date;
  updatedAt: Date;
  version: string;               // "1.0.0"
}
```

### HeatmapConfig (Configuración)

```typescript
interface HeatmapConfig {
  axes: {
    x: AxisConfig;               // Frecuencia
    y: AxisConfig;               // Impacto
  };
  zones: RiskZone[];
  display: DisplayOptions;
  labels: LabelConfig;
}

interface AxisConfig {
  min: number;
  max: number;
  scale: 'linear' | 'log';
  unit?: string;
  divisions: number[];           // [0.1, 0.2, 0.3, 0.5, 1, 3, 5...]
}

interface RiskZone {
  id: string;
  name: string;                  // "Bajo", "Medio", "Alto", "Crítico"
  color: string;
  bounds: {
    minScore: number;
    maxScore: number;
  };
}

interface DisplayOptions {
  showGrid: boolean;
  showLabels: boolean;
  showIndicators: boolean;
  showTable: boolean;
  showLegend: boolean;
  lineThickness: number;         // 1-5
}

interface LabelConfig {
  title: string;
  subtitle?: string;
  xAxisLabel: string;
  yAxisLabel: string;
}
```

## 2. VALORES POR DEFECTO

```typescript
const DEFAULT_CONFIG: HeatmapConfig = {
  axes: {
    x: {
      min: 0.1,
      max: 50,
      scale: 'log',
      unit: 'eventos/año',
      divisions: [0.1, 0.2, 0.3, 0.5, 1, 3, 5, 10, 30, 50]
    },
    y: {
      min: 0.1,
      max: 120,
      scale: 'log',
      unit: 'M',
      divisions: [0.1, 0.5, 1, 3, 5, 10, 20, 40, 80, 120]
    }
  },
  zones: [
    { id: 'low', name: 'Bajo', color: '#10B981', bounds: { minScore: -10, maxScore: 0 } },
    { id: 'medium', name: 'Medio', color: '#FCD34D', bounds: { minScore: 0, maxScore: 1 } },
    { id: 'high', name: 'Alto', color: '#FB923C', bounds: { minScore: 1, maxScore: 2 } },
    { id: 'critical', name: 'Crítico', color: '#EF4444', bounds: { minScore: 2, maxScore: 10 } }
  ],
  display: {
    showGrid: true,
    showLabels: true,
    showIndicators: false,
    showTable: true,
    showLegend: true,
    lineThickness: 3
  },
  labels: {
    title: 'Risk Heatmap (POC)',
    subtitle: 'RISK & COMPLIANCE',
    xAxisLabel: 'FRECUENCIA ANUAL',
    yAxisLabel: 'IMPACTO ECONÓMICO'
  }
};

const EXAMPLE_RISKS: Risk[] = [
  {
    id: 'R1',
    name: 'Reclamos laborales de terceros',
    impact: { min: 6, max: 25, unit: 'M' },
    frequency: { min: 1, max: 5 },
    appetite: 'aversion',
    color: '#FB923C',
    displayLine: 'min-max',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'R2',
    name: 'Incendio en depósitos',
    impact: { min: 10, max: 70, unit: 'M' },
    frequency: { min: 0.2, max: 0.3 },
    appetite: 'aversion',
    color: '#FB923C',
    displayLine: 'min-max',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
```

## 3. STORAGE

### LocalStorage Keys

```typescript
const STORAGE_KEYS = {
  CURRENT_PROJECT_ID: 'heatmap_current_project',
  PROJECTS: 'heatmap_projects',
  USER_PREFERENCES: 'heatmap_preferences'
};
```

### LocalStorage Functions

```typescript
function saveProject(project: Project): void {
  const projects = loadAllProjects();
  const index = projects.findIndex(p => p.id === project.id);
  
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

function loadAllProjects(): Project[] {
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : [];
}

function loadCurrentProject(): Project | null {
  const id = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT_ID);
  if (!id) return null;
  
  const projects = loadAllProjects();
  return projects.find(p => p.id === id) || null;
}
```
