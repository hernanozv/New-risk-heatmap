# Heatmap de Riesgos Avanzado - Visión y Análisis

## 1. RESUMEN EJECUTIVO

### 1.1 Visión del Producto
Aplicación web moderna que permite a analistas de riesgo crear heatmaps avanzados que visualizan no solo la posición de riesgo promedio, sino **distribuciones completas de riesgo** mediante líneas que conectan escenarios (peor caso, más probable, P90, etc.).

### 1.2 Diferenciadores Clave vs. Heatmaps Tradicionales

| Aspecto | Heatmap Tradicional | Esta Solución |
|---------|---------------------|---------------|
| Representación | Punto único | Línea con distribución |
| Información | Solo valor promedio | Rango completo (min, media, P90, max) |
| Incertidumbre | No visible | Claramente visible |
| Escalas | Lineales simples | Logarítmicas profesionales |
| Análisis | Estático | Interactivo con escenarios |
| Comunicación | Ambigua | Precisa y detallada |

### 1.3 Casos de Uso Principal
- **Riesgo Financiero**: Bancos, aseguradoras, fondos de inversión
- **Riesgo Operacional**: Empresas manufactureras, logística
- **Riesgo de Cumplimiento**: Regulación, compliance
- **Riesgo Cibernético**: Departamentos IT, CISO
- **Riesgo de Proyecto**: Gestión de proyectos complejos

---

## 2. ANÁLISIS DETALLADO DE LAS IMÁGENES PROPORCIONADAS

### 2.1 Imagen 1 - Heatmap Completo con Tabla

#### Componentes Identificados:

**Header**
- Título: "Risk Heatmap (POC)"
- Subtítulo: "RISK & COMPLIANCE"
- Logo corporativo (esquina superior derecha)

**Ejes del Heatmap**
- **Eje X (Frecuencia Anual)**:
  - Escala logarítmica
  - Valores: 0.1, 0.2, 0.3, 0.5, 1, 3, 5, 10, 30, 50
  - Unidad: eventos por año

- **Eje Y (Impacto Económico)**:
  - Escala logarítmica
  - Valores: 0.1M, 0.5M, 1M, 3M, 5M, 10M, 20M, 40M, 80M, 120M
  - Unidad: millones de moneda

**Matriz de Colores**
- Verde (bajo): Frecuencia < 1, Impacto < 5M
- Amarillo (medio): Zona intermedia
- Naranja (aversión): Frecuencia > 3 o Impacto > 20M
- Rojo (intolerable): Frecuencia > 5 e Impacto > 10M

**Riesgos Visualizados**
1. **R1**: Línea diagonal ascendente
   - Punto inferior: ~(0.2, 10M)
   - Punto superior: ~(0.3, 80M)
   - Zona: Amarillo-Naranja

2. **R2**: Línea diagonal
   - Punto inferior: ~(0.3, 20M)
   - Punto superior: ~(0.5, 70M)
   - Marcador naranja
   - Zona: Naranja

3. **R3**: Línea vertical corta
   - Punto inferior: ~(5, 1M)
   - Punto superior: ~(5, 5M)
   - Marcador rojo
   - Zona: Amarillo

4. **R4**: Línea vertical corta
   - Punto inferior: ~(10, 0.5M)
   - Punto superior: ~(10, 1M)
   - Marcador rojo
   - Zona: Amarillo-Naranja

**Indicadores Especiales**
- "Media del Impacto": Línea punteada vertical con flecha
- "Rango de Frecuencia de Eventos": Línea punteada horizontal con flecha
- "Valor en Riesgo (VaR) P90": Línea punteada diagonal con flecha

**Tabla de Detalles (Lado Izquierdo)**
| R# | Riesgo | Impacto | Frecuencia | Apetito |
|----|--------|---------|------------|---------|
| R1 | Reclamos laborales de terceros | 6M - 25M | 1 - 5 | Aversión |
| R2 | Incendio en depósitos | 10M - 70M | 0.2 - 0.3 | Aversión |
| R3 | Incumplimientos de renovación de licencias, habilitaciones y/o permisos | 1M - 5M | 3 - 7 | Intolerable |
| R4 | Accidentes laborales con fatalidades | 0.4M - 1M | 10 | Intolerable |

**Leyenda**
- Círculo rojo: Intolerable
- Círculo naranja: Aversión

### 2.2 Imagen 2 - Documento Explicativo

**Título**: "Heatmaps con mayor amplitud de detalle"

**Puntos Clave Destacados**:

1. **Captura la variabilidad del impacto**: Muestra un rango en lugar de un solo valor, reflejando correctamente la incertidumbre y posibles variaciones en las consecuencias.

2. **Frecuencia estimada concreta**: Utilizar la frecuencia de ocurrencia (número de veces al año) hace que el análisis sea más tangible y comprensible.

3. **Identificación de riesgos críticos**: Al combinar el rango de impacto con la frecuencia estimada, es más sencillo identificar riesgos críticos.

4. **Visualización clara para stakeholders**: Un heatmap detallado permite a los stakeholders comprender rápidamente el panorama de riesgos.

5. **Facilita el establecimiento de umbrales y límites de riesgo**: Con información más granular, es más sencillo definir límites aceptables.

6. **Integración con metodologías cuantitativas**: Permite complementarse con técnicas como el análisis del Valor en Riesgo (VaR) o simulaciones de Monte Carlo.

**Heatmap Simplificado**:
- Muestra 4 líneas diagonales
- Diferentes pendientes y longitudes
- Escala similar al Imagen 1

### 2.3 Imagen 3 - Vista Ampliada del Heatmap

**Características**:
- Vista más grande y clara del heatmap
- Sin tabla lateral ni header
- Mismo diseño de colores y escalas
- Mejor visibilidad de:
  - Grosor de líneas (~3px)
  - Tamaño de marcadores circulares
  - Gradiente de colores de fondo
  - Grid sutil pero presente

---

## 3. REQUERIMIENTOS FUNCIONALES DERIVADOS

### 3.1 Requerimientos Críticos (Imprescindibles para MVP)

#### RF-01: Gestión de Riesgos
- **RF-01.1**: Crear nuevo riesgo con ID, nombre, impacto (min-max), frecuencia (min-max)
- **RF-01.2**: Editar riesgo existente
- **RF-01.3**: Eliminar riesgo con confirmación
- **RF-01.4**: Listar todos los riesgos del proyecto

#### RF-02: Visualización del Heatmap
- **RF-02.1**: Renderizar heatmap con ejes logarítmicos
- **RF-02.2**: Mostrar matriz de colores de fondo (4 zonas de riesgo)
- **RF-02.3**: Representar cada riesgo como línea conectando dos puntos
- **RF-02.4**: Mostrar marcador circular con ID del riesgo
- **RF-02.5**: Aplicar color al marcador según categoría de apetito

#### RF-03: Tabla de Detalles
- **RF-03.1**: Mostrar tabla con columnas: R#, Riesgo, Impacto, Frecuencia, Apetito
- **RF-03.2**: Sincronizar datos con el heatmap en tiempo real
- **RF-03.3**: Formato de impacto: "MinM - MaxM"
- **RF-03.4**: Formato de frecuencia: "Min - Max"

#### RF-04: Exportación Básica
- **RF-04.1**: Exportar heatmap como PNG
- **RF-04.2**: Exportar datos como JSON (backup)

#### RF-05: Persistencia
- **RF-05.1**: Guardar proyecto en LocalStorage
- **RF-05.2**: Cargar proyecto desde LocalStorage
- **RF-05.3**: Auto-guardado cada 30 segundos

### 3.2 Requerimientos Importantes (Versión 1.0)

#### RF-06: Configuración del Heatmap
- **RF-06.1**: Ajustar rango de ejes (min/max)
- **RF-06.2**: Configurar colores de zonas de riesgo
- **RF-06.3**: Personalizar título y subtítulo

#### RF-07: Interactividad
- **RF-07.1**: Tooltip al hacer hover sobre riesgo
- **RF-07.2**: Click en riesgo para abrir edición
- **RF-07.3**: Highlight de riesgo seleccionado

#### RF-08: Valores Estadísticos Avanzados
- **RF-08.1**: Capturar impacto medio y P90 (además de min/max)
- **RF-08.2**: Capturar frecuencia media y P90
- **RF-08.3**: Seleccionar qué puntos conectar (min-max vs mean-p90)

#### RF-09: Exportación Avanzada
- **RF-09.1**: Exportar como PDF con tabla incluida
- **RF-09.2**: Exportar datos como Excel
- **RF-09.3**: Configuración de exportación (tamaño, resolución)

#### RF-10: Múltiples Proyectos
- **RF-10.1**: Crear nuevo proyecto
- **RF-10.2**: Selector de proyecto activo
- **RF-10.3**: Eliminar proyecto

### 3.3 Requerimientos Deseables (Versión 2.0)

#### RF-11: Indicadores Estadísticos
- **RF-11.1**: Mostrar línea de "Media del Impacto"
- **RF-11.2**: Mostrar línea de "Rango de Frecuencia"
- **RF-11.3**: Mostrar línea de "VaR P90"
- **RF-11.4**: Configurar estilo de líneas de referencia

#### RF-12: Análisis de Escenarios
- **RF-12.1**: Crear múltiples escenarios del mismo proyecto
- **RF-12.2**: Comparar dos heatmaps lado a lado
- **RF-12.3**: Animación de transición entre escenarios

#### RF-13: Colaboración
- **RF-13.1**: Compartir proyecto vía link
- **RF-13.2**: Comentarios en riesgos específicos
- **RF-13.3**: Historial de cambios

#### RF-14: Importación de Datos
- **RF-14.1**: Importar desde Excel (template)
- **RF-14.2**: Importar desde CSV
- **RF-14.3**: Mapeo de columnas flexible

#### RF-15: Zoom y Pan
- **RF-15.1**: Zoom con scroll del mouse
- **RF-15.2**: Pan con click y arrastrar
- **RF-15.3**: Botón "Reset View"

---

## 4. REQUERIMIENTOS NO FUNCIONALES

### 4.1 Usabilidad
- **RNF-01**: Interfaz intuitiva sin necesidad de manual
- **RNF-02**: Tiempo de aprendizaje < 10 minutos para usuario experto en riesgo
- **RNF-03**: Máximo 3 clicks para agregar un riesgo completo
- **RNF-04**: Feedback visual inmediato (< 100ms) para todas las acciones

### 4.2 Performance
- **RNF-05**: Renderizado del heatmap < 500ms con hasta 50 riesgos
- **RNF-06**: Exportación a PNG < 2 segundos
- **RNF-07**: Auto-guardado sin bloquear la UI

### 4.3 Compatibilidad
- **RNF-08**: Soporte para navegadores modernos (Chrome, Firefox, Edge, Safari)
- **RNF-09**: Responsive design (mínimo 1280px de ancho recomendado)
- **RNF-10**: Exportaciones compatibles con Office 365 y Google Workspace

### 4.4 Accesibilidad
- **RNF-11**: Contraste de colores accesible (WCAG 2.1 AA)
- **RNF-12**: Navegación por teclado para funciones principales
- **RNF-13**: Tooltips descriptivos para todos los iconos

### 4.5 Seguridad y Privacidad
- **RNF-14**: Datos almacenados solo en el navegador del usuario (LocalStorage)
- **RNF-15**: Sin envío de datos a servidores externos en MVP
- **RNF-16**: Opción de limpiar todos los datos

---

## 5. PRIORIZACIÓN Y ROADMAP

### Fase 1: MVP (4-6 semanas)
**Objetivo**: Heatmap funcional básico con exportación

- ✅ Setup del proyecto (React + TypeScript + TailwindCSS)
- ✅ Modelo de datos (Risk, Project)
- ✅ CRUD de riesgos
- ✅ Visualización básica del heatmap
- ✅ Tabla de detalles
- ✅ Exportación PNG
- ✅ LocalStorage para persistencia

**Entregables**:
- Aplicación funcional desplegada
- README con instrucciones
- 5-10 riesgos de ejemplo pre-cargados

### Fase 2: Versión 1.0 (2-3 semanas adicionales)
**Objetivo**: Configuración avanzada y mejores exportaciones

- ⏳ Panel de configuración del heatmap
- ⏳ Valores estadísticos avanzados (media, P90)
- ⏳ Interactividad (hover, click, tooltips)
- ⏳ Exportación PDF y Excel
- ⏳ Múltiples proyectos

**Entregables**:
- Versión pulida con configuración
- Video tutorial (3-5 min)
- Template de Excel para importación

### Fase 3: Versión 2.0 (4-6 semanas adicionales)
**Objetivo**: Análisis avanzado y colaboración

- 🔮 Indicadores estadísticos visuales
- 🔮 Análisis de escenarios
- 🔮 Importación de datos
- 🔮 Zoom y pan
- 🔮 Backend opcional para compartir
- 🔮 Historial de cambios

**Entregables**:
- Aplicación completa enterprise-ready
- Documentación técnica completa
- API documentation (si se implementa backend)

---

## 6. MÉTRICAS DE ÉXITO

### 6.1 Métricas de Adopción
- Tiempo promedio de sesión > 10 minutos
- Número de proyectos creados por usuario > 3
- Tasa de retención de usuarios a 30 días > 60%

### 6.2 Métricas de Usabilidad
- Tasa de completación de "crear primer riesgo" > 90%
- Tiempo para crear primer heatmap completo (5 riesgos) < 15 minutos
- Tasa de exportación exitosa > 95%

### 6.3 Métricas de Calidad
- Errores reportados por usuario < 1 por semana
- Tiempo de carga inicial < 3 segundos
- Uptime > 99% (si hay backend)

---

## 7. RIESGOS Y MITIGACIONES

### Riesgo 1: Complejidad de Escalas Logarítmicas
**Impacto**: Alto | **Probabilidad**: Media

**Mitigación**:
- Usar biblioteca probada (D3.js) para escalas
- Tests exhaustivos con valores extremos
- Validación de entradas del usuario

### Riesgo 2: Performance con Muchos Riesgos
**Impacto**: Medio | **Probabilidad**: Baja

**Mitigación**:
- Virtualización si > 100 riesgos
- Memoización de cálculos pesados
- Web Workers para exportaciones

### Riesgo 3: Inconsistencia Visual entre Pantalla y Exportación
**Impacto**: Alto | **Probabilidad**: Media

**Mitigación**:
- Usar mismo motor de renderizado (SVG)
- Tests de comparación pixel-perfect
- Preview antes de exportar

### Riesgo 4: Límite de LocalStorage
**Impacto**: Bajo | **Probabilidad**: Baja

**Mitigación**:
- Monitoreo de uso de storage
- Advertencia al usuario
- Compresión de datos (si es necesario)
- Migración a IndexedDB si se requiere

---

## 8. STAKEHOLDERS Y ROLES

### Stakeholders Primarios
- **Analistas de Riesgo**: Usuarios principales de la herramienta
- **CISO / CRO**: Consumidores de reportes
- **Comités de Riesgo**: Audiencia de presentaciones

### Roles del Equipo de Desarrollo
- **Product Owner**: Define prioridades y valida funcionalidades
- **UX Designer**: Diseña flujos y interfaces
- **Frontend Developer**: Implementa React/TypeScript
- **QA Engineer**: Testing funcional y de usabilidad
- **DevOps**: (Si hay backend) Infraestructura y CI/CD

### Comunicación
- Revisiones semanales de progreso
- Demos al final de cada fase
- Feedback continuo de usuarios beta
