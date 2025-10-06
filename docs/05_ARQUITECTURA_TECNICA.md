# Arquitectura Técnica

## Stack Tecnológico

**Frontend**:
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- D3.js (escalas) + SVG
- Zustand (estado global)
- React Hook Form + Zod
- Lucide React (iconos)

**Exportación**:
- PNG: html2canvas
- PDF: jsPDF
- Excel: xlsx

## Estructura de Carpetas

```
src/
├── components/
│   ├── ui/              # shadcn/ui
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── RiskCard.tsx
│   ├── Heatmap.tsx
│   ├── RiskTable.tsx
│   ├── RiskModal.tsx
│   └── ConfigModal.tsx
├── hooks/
│   ├── useProject.ts
│   ├── useRisks.ts
│   └── useHeatmap.ts
├── lib/
│   ├── algorithms/
│   │   ├── scales.ts
│   │   ├── scoring.ts
│   │   └── rendering.ts
│   ├── storage.ts
│   ├── export.ts
│   └── utils.ts
├── types/
│   ├── risk.ts
│   └── config.ts
├── store/
│   └── projectStore.ts
└── App.tsx
```

## Store (Zustand)

```typescript
interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  
  loadProjects: () => void;
  setCurrentProject: (id: string) => void;
  addRisk: (risk: Risk) => void;
  updateRisk: (id: string, risk: Risk) => void;
  deleteRisk: (id: string) => void;
}
```

## Flujo de Datos

```
User Action → Component → Store → LocalStorage
                  ↓
              Re-render
```

## Optimizaciones

- React.memo() para componentes pesados
- useMemo() para cálculos de escalas
- useCallback() para event handlers
- Debouncing en auto-guardado (30s)
