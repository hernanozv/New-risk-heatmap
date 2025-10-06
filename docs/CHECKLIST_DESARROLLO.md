# ✅ Checklist de Desarrollo

## 🏗️ Setup Inicial

- [ ] Crear proyecto Vite + React + TypeScript
- [ ] Configurar TailwindCSS
- [ ] Instalar shadcn/ui
- [ ] Configurar ESLint + Prettier
- [ ] Configurar Git + .gitignore
- [ ] Crear estructura de carpetas

## 📦 Dependencias

- [ ] zustand (estado)
- [ ] react-hook-form + zod (formularios)
- [ ] lucide-react (iconos)
- [ ] d3-scale (escalas logarítmicas)
- [ ] html2canvas (export PNG)
- [ ] jspdf (export PDF)
- [ ] xlsx (export Excel)

## 🎨 Componentes UI Base

- [ ] Button (shadcn/ui)
- [ ] Dialog / Modal (shadcn/ui)
- [ ] Select (shadcn/ui)
- [ ] Input (shadcn/ui)
- [ ] Table (shadcn/ui)
- [ ] Dropdown Menu (shadcn/ui)

## 📝 TypeScript Types

- [ ] `types/risk.ts` - Interface Risk
- [ ] `types/config.ts` - Interface HeatmapConfig, AxisConfig, RiskZone
- [ ] `types/project.ts` - Interface Project

## 🧮 Algoritmos Core

- [ ] `lib/algorithms/scales.ts`
  - [ ] valueToScreen()
  - [ ] screenToValue()
  - [ ] generateLogDivisions()
  
- [ ] `lib/algorithms/scoring.ts`
  - [ ] calculateRiskScore()
  - [ ] getRiskZone()
  
- [ ] `lib/algorithms/rendering.ts`
  - [ ] calculateRiskLinePoints()
  - [ ] getBackgroundColorAt()

## 💾 Storage & State

- [ ] `store/projectStore.ts` - Zustand store
  - [ ] Estado: currentProject, projects
  - [ ] loadProjects()
  - [ ] setCurrentProject()
  - [ ] addRisk()
  - [ ] updateRisk()
  - [ ] deleteRisk()
  
- [ ] `lib/storage.ts`
  - [ ] saveProject()
  - [ ] loadProject()
  - [ ] loadAllProjects()
  - [ ] Auto-save con debounce

## 🎯 Componentes Principales

### Header
- [ ] Logo y título
- [ ] Selector de proyecto
- [ ] Botón Guardar
- [ ] Botón Exportar (dropdown)
- [ ] Indicador de guardado

### Sidebar
- [ ] Input de búsqueda
- [ ] Filtros por apetito
- [ ] Botón "+ Agregar Riesgo"
- [ ] Lista scrollable de RiskCards
- [ ] Botones de acciones rápidas

### RiskCard
- [ ] Marcador circular con ID
- [ ] Nombre del riesgo (truncado)
- [ ] Stats de impacto y frecuencia
- [ ] Badge de apetito
- [ ] Botones editar y eliminar
- [ ] Hover state

### RiskModal
- [ ] Formulario con validación
- [ ] Campos: ID, Nombre, Descripción
- [ ] Inputs de Impacto (min, mean, p90, max)
- [ ] Inputs de Frecuencia (min, mean, p90, max)
- [ ] Radio buttons de apetito
- [ ] Color picker
- [ ] Vista previa (opcional)
- [ ] Botones Cancelar y Guardar

### Heatmap
- [ ] SVG responsive
- [ ] Matriz de colores de fondo
- [ ] Ejes con escalas logarítmicas
- [ ] Grid
- [ ] Etiquetas de ejes
- [ ] Líneas de riesgos
- [ ] Marcadores circulares
- [ ] Etiquetas de IDs
- [ ] Leyenda
- [ ] Hover tooltips
- [ ] Click para editar

### RiskTable
- [ ] Headers: R#, Riesgo, Impacto, Frecuencia, Apetito, Acciones
- [ ] Renderizado de todas las filas
- [ ] Hover state
- [ ] Click en fila (seleccionar)
- [ ] Botones editar/eliminar
- [ ] Ordenamiento por columna (opcional)

### ConfigModal
- [ ] Configuración de ejes (min/max)
- [ ] Toggle escalas logarítmicas
- [ ] Configuración de zonas de riesgo
- [ ] Opciones de visualización
- [ ] Configuración de etiquetas
- [ ] Botones: Restaurar defaults, Cancelar, Aplicar

## 📤 Exportación

- [ ] `lib/export.ts`
  - [ ] exportAsPNG()
  - [ ] exportAsPDF()
  - [ ] exportAsExcel()
  - [ ] exportAsJSON()

## 🎨 Datos de Ejemplo

- [ ] `data/defaultConfig.ts` - Configuración por defecto
- [ ] `data/exampleRisks.ts` - 5 riesgos de ejemplo
- [ ] Proyecto pre-cargado en primera ejecución

## 🧪 Testing

- [ ] Test de algoritmos de escalas
- [ ] Test de cálculo de risk score
- [ ] Test de componentes clave
- [ ] Test de store
- [ ] Test de storage

## 🎯 Features MVP

- [ ] Crear proyecto
- [ ] Agregar riesgo con valores min-max
- [ ] Editar riesgo
- [ ] Eliminar riesgo (con confirmación)
- [ ] Visualizar heatmap con 4 zonas de color
- [ ] Ver tabla de detalles
- [ ] Exportar como PNG
- [ ] Guardar en LocalStorage
- [ ] Auto-guardado cada 30s

## 🚀 Deployment

- [ ] Build production (`npm run build`)
- [ ] Test build local (`npm run preview`)
- [ ] Deploy a Vercel/Netlify
- [ ] Configurar dominio (opcional)
- [ ] Configurar analytics (opcional)

## 📚 Documentación Final

- [ ] README actualizado
- [ ] Screenshots en `/docs/screenshots/`
- [ ] Video demo (opcional)
- [ ] Changelog
- [ ] Contributing guidelines

---

## 🎯 Sprint 1 (MVP Core)

**Objetivo**: Heatmap básico funcional

- [ ] Setup completo
- [ ] Tipos + algoritmos
- [ ] Store + storage
- [ ] Header + Sidebar (visual)
- [ ] RiskModal funcional
- [ ] Heatmap renderizado básico
- [ ] CRUD de riesgos funcionando

## 🎯 Sprint 2 (Interactividad)

**Objetivo**: UX completa

- [ ] Hover en heatmap
- [ ] Tooltips
- [ ] Click para editar
- [ ] Tabla funcional
- [ ] Validaciones completas
- [ ] Feedback visual

## 🎯 Sprint 3 (Exportación & Polish)

**Objetivo**: Producto listo para usar

- [ ] Exportación PNG/PDF
- [ ] Auto-save
- [ ] Datos de ejemplo
- [ ] Polish visual
- [ ] Deploy
- [ ] README completo

---

**Nota**: Marcar ✅ a medida que se completan las tareas
