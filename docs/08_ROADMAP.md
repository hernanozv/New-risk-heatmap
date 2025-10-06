# Roadmap de Desarrollo

## FASE 1: MVP (4-6 semanas)

### Semana 1-2: Setup y Fundamentos
- ✅ Crear proyecto React + TypeScript + Vite
- ✅ Configurar TailwindCSS + shadcn/ui
- ✅ Definir tipos TypeScript (Risk, Project, Config)
- ✅ Implementar algoritmos de escalas logarítmicas
- ✅ Crear store de Zustand
- ✅ Implementar LocalStorage

### Semana 3-4: Componentes Core
- ⏳ Header con selector de proyecto
- ⏳ Sidebar con lista de riesgos
- ⏳ RiskCard component
- ⏳ RiskModal (agregar/editar)
- ⏳ Heatmap básico (SVG con D3 scales)
- ⏳ RiskTable

### Semana 5-6: Features y Polish
- ⏳ Exportación PNG
- ⏳ Validaciones de formulario
- ⏳ Interactividad básica (hover, click)
- ⏳ 5 riesgos de ejemplo pre-cargados
- ⏳ README y deployment

**Entregable**: Aplicación funcional desplegada en Vercel/Netlify

---

## FASE 2: Versión 1.0 (2-3 semanas)

### Semana 7-8: Configuración Avanzada
- ⏳ ConfigModal completo
- ⏳ Valores estadísticos (media, P90)
- ⏳ Selector de tipo de línea (min-max vs mean-p90)
- ⏳ Tooltips detallados

### Semana 9: Exportaciones Premium
- ⏳ Exportación PDF con tabla
- ⏳ Exportación Excel multi-hoja
- ⏳ Exportación SVG
- ⏳ Múltiples proyectos

**Entregable**: Versión 1.0 con configuración completa

---

## FASE 3: Versión 2.0 (4-6 semanas)

### Semana 10-11: Análisis Avanzado
- 🔮 Indicadores estadísticos visuales (líneas de referencia)
- 🔮 Zoom y pan en heatmap
- 🔮 Filtros avanzados
- 🔮 Búsqueda y ordenamiento

### Semana 12-13: Importación y Backend
- 🔮 Importación desde Excel
- 🔮 Importación desde CSV
- 🔮 Backend opcional (Node.js + PostgreSQL)
- 🔮 Autenticación y usuarios

### Semana 14-15: Colaboración
- 🔮 Compartir proyectos vía link
- 🔮 Comentarios en riesgos
- 🔮 Historial de cambios
- 🔮 Comparación de escenarios lado a lado

**Entregable**: Aplicación enterprise-ready

---

## Métricas de Éxito

### Adopción
- [ ] 100+ usuarios en primer mes
- [ ] 500+ proyectos creados
- [ ] 3+ proyectos promedio por usuario

### Usabilidad
- [ ] Tiempo para crear primer heatmap < 15 min
- [ ] Tasa de completación > 90%
- [ ] Net Promoter Score > 50

### Técnicas
- [ ] Tiempo de carga < 3 segundos
- [ ] Exportación exitosa > 95%
- [ ] Errores reportados < 1/semana/usuario
