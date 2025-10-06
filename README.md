# Risk Heatmap - Visualización Avanzada de Riesgos

Aplicación web para crear heatmaps de riesgos con distribuciones completas (no solo puntos únicos), permitiendo visualizar la variabilidad e incertidumbre de cada riesgo.

## 🎯 Características Principales

- **Distribuciones de Riesgo**: Visualiza rangos completos (min-max, media-P90) en lugar de puntos únicos
- **Escalas Logarítmicas**: Profesional y adecuado para análisis de riesgo
- **Zonas de Riesgo Configurables**: Verde, Amarillo, Naranja, Rojo
- **Exportación Múltiple**: PNG, PDF, Excel
- **Interactivo**: Hover, tooltips, edición en tiempo real
- **Multi-Proyecto**: Gestiona múltiples análisis de riesgo

## 📊 Diferenciadores vs. Heatmaps Tradicionales

| Aspecto | Tradicional | Esta Solución |
|---------|-------------|---------------|
| Representación | Punto único | Línea con distribución |
| Información | Solo promedio | Min, Media, P90, Max |
| Incertidumbre | No visible | Claramente visible |
| Escalas | Lineales | Logarítmicas |

## 🚀 Quick Start

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/risk-heatmap.git
cd risk-heatmap

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📁 Documentación

- [01 - Visión y Análisis](docs/01_VISION_Y_ANALISIS.md)
- [02 - Diseño de Interfaz](docs/02_DISENO_INTERFAZ.md)
- [03 - Modelo de Datos](docs/03_MODELO_DATOS.md)
- [04 - Algoritmos](docs/04_ALGORITMOS.md)
- [05 - Arquitectura Técnica](docs/05_ARQUITECTURA_TECNICA.md)
- [06 - Flujos de Usuario](docs/06_FLUJOS_USUARIO.md)
- [07 - Casos de Uso](docs/07_CASOS_USO.md)
- [08 - Roadmap](docs/08_ROADMAP.md)
- [09 - Guía de Implementación](docs/09_GUIA_IMPLEMENTACION.md)

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Visualización**: D3.js + SVG
- **Estado**: Zustand
- **Build**: Vite

## 📝 Uso Básico

1. **Crear Proyecto**: Click en "Nuevo Proyecto"
2. **Agregar Riesgos**: Click en "+ Agregar Riesgo"
3. **Completar Datos**: ID, Nombre, Impacto (min-max), Frecuencia (min-max), Apetito
4. **Visualizar**: El heatmap se actualiza automáticamente
5. **Exportar**: PDF, PNG o Excel

## 🎨 Ejemplo Visual

Ver imágenes de referencia en `/docs/screenshots/`

## 🧪 Testing

```bash
npm run test
```

## 📦 Build

```bash
npm run build
npm run preview
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crea Pull Request

## 📄 Licencia

MIT

## 👥 Autores

- Tu Nombre

## 📧 Contacto

- Email: tu-email@ejemplo.com
- LinkedIn: tu-linkedin
