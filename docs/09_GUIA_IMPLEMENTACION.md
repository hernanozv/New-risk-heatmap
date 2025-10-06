# Guía de Implementación

## Paso 1: Setup Inicial

```bash
# Crear proyecto
npm create vite@latest risk-heatmap -- --template react-ts
cd risk-heatmap

# Instalar dependencias
npm install
npm install -D tailwindcss postcss autoprefixer
npm install zustand
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react
npm install d3-scale d3-array
npm install html2canvas jspdf xlsx

# Configurar TailwindCSS
npx tailwindcss init -p
```

## Paso 2: Configurar shadcn/ui

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dropdown-menu
```

## Paso 3: Estructura de Tipos

Crear archivos en `src/types/`:
- `risk.ts` - Interface Risk
- `config.ts` - Interface HeatmapConfig
- `project.ts` - Interface Project

## Paso 4: Algoritmos Core

Crear archivos en `src/lib/algorithms/`:
- `scales.ts` - valueToScreen(), screenToValue()
- `scoring.ts` - calculateRiskScore(), getRiskZone()
- `rendering.ts` - calculateRiskLinePoints()

## Paso 5: Store

Crear `src/store/projectStore.ts` con Zustand:
- Estado: currentProject, projects
- Acciones: CRUD de proyectos y riesgos

## Paso 6: Componentes UI

Orden de implementación:
1. **Header** - Barra superior con selector y botones
2. **Sidebar** - Lista de riesgos lateral
3. **RiskCard** - Tarjeta individual de riesgo
4. **RiskModal** - Formulario agregar/editar
5. **Heatmap** - Visualización principal (SVG)
6. **RiskTable** - Tabla de detalles
7. **ConfigModal** - Configuración avanzada

## Paso 7: Implementar Heatmap

```typescript
// Pseudocódigo estructura básica
function Heatmap({ risks, config }) {
  // 1. Calcular dimensiones y padding
  // 2. Crear escalas D3
  // 3. Renderizar matriz de colores
  // 4. Renderizar ejes
  // 5. Renderizar líneas de riesgos
  // 6. Renderizar marcadores
  // 7. Agregar interactividad (hover, click)
  
  return <svg>{/* elementos */}</svg>;
}
```

## Paso 8: LocalStorage

Implementar en `src/lib/storage.ts`:
- saveProject()
- loadProject()
- loadAllProjects()
- Auto-guardado con debounce

## Paso 9: Exportación

Implementar en `src/lib/export.ts`:
- exportAsPNG()
- exportAsPDF()
- exportAsExcel()

## Paso 10: Testing y Deploy

```bash
# Tests
npm run test

# Build
npm run build

# Deploy a Vercel
npm install -g vercel
vercel --prod
```

## Orden de Prioridad

### Sprint 1 (Semana 1-2)
1. Setup + tipos + algoritmos
2. Store básico
3. Header + Sidebar sin funcionalidad

### Sprint 2 (Semana 3-4)
1. RiskModal funcional
2. Heatmap básico (sin interactividad)
3. RiskTable
4. CRUD de riesgos funcionando

### Sprint 3 (Semana 5-6)
1. Interactividad en heatmap
2. Exportación PNG
3. Polish visual
4. Deploy

## Consejos de Implementación

1. **Comenzar simple**: Heatmap con valores hardcodeados primero
2. **Escala logarítmica**: Usar D3.js, no reinventar
3. **SVG sobre Canvas**: Mejor para interactividad
4. **Componentes pequeños**: Máximo 200 líneas
5. **Types estrictos**: No usar `any`
6. **Testing incremental**: Test cada algoritmo
7. **Git commits frecuentes**: Cada feature funcional
