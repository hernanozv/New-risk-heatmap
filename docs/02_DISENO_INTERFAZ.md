# Diseño de Interfaz - Heatmap de Riesgos

## 1. LAYOUT PRINCIPAL

```
┌────────────────────────────────────────────────────────┐
│  HEADER (64px)                                         │
│  Logo │ Proyecto: [Selector] │ [Guardar] [Exportar]  │
├───────────┬────────────────────────────────────────────┤
│ SIDEBAR   │  CANVAS PRINCIPAL                          │
│ (320px)   │                                            │
│           │  ┌──────────────────────────────────────┐  │
│ + Agregar │  │       HEATMAP SVG (Logarítmico)      │  │
│ □ R1      │  │                                      │  │
│ □ R2      │  └──────────────────────────────────────┘  │
│ □ R3      │  ┌──────────────────────────────────────┐  │
│ ⚙ Config  │  │ TABLA DE DETALLES                    │  │
│ 📊 Stats  │  └──────────────────────────────────────┘  │
└───────────┴────────────────────────────────────────────┘
```

**Dimensiones**:
- Header: 64px altura
- Sidebar: 320px ancho
- Heatmap: Aspecto 16:9
- Tabla: 200px altura

## 2. COMPONENTES PRINCIPALES

### Header
- Logo + Título
- Selector de proyecto (dropdown)
- Botones: Guardar, Exportar
- Indicador de guardado

### Sidebar - Lista de Riesgos
- Búsqueda
- Filtros por apetito
- Botón "Agregar Riesgo"
- Lista de RiskCards
- Acciones rápidas (Config, Stats)

### RiskCard
- Marcador circular con ID
- Nombre del riesgo
- Impacto y frecuencia
- Badge de apetito
- Botones: Editar, Eliminar

### Heatmap
- Ejes logarítmicos
- Matriz de colores (4 zonas)
- Líneas de riesgo
- Marcadores circulares
- Grid de fondo
- Leyenda

### Tabla de Detalles
- Columnas: R#, Riesgo, Impacto, Frecuencia, Apetito, Acciones
- Ordenamiento por columna
- Hover sincronizado con heatmap
