# Especificación de Template Excel para Importación

## Estructura del Archivo

**Nombre sugerido**: `risk-import-template.xlsx`

## Hoja 1: "Riesgos"

### Columnas Requeridas

| Columna | Tipo | Ejemplo | Descripción | Requerido |
|---------|------|---------|-------------|-----------|
| ID | Texto | R1 | Identificador único | ✅ |
| Nombre | Texto | Reclamos laborales | Nombre corto del riesgo | ✅ |
| Descripción | Texto | Reclamos de terceros... | Descripción detallada | ❌ |
| ImpactoMin | Número | 6 | Impacto mínimo | ✅ |
| ImpactoMax | Número | 25 | Impacto máximo | ✅ |
| ImpactoMedio | Número | 15 | Impacto promedio | ❌ |
| ImpactoP90 | Número | 22 | Impacto percentil 90 | ❌ |
| UnidadImpacto | Texto | M | K, M, B (miles, millones, billones) | ✅ |
| FrecuenciaMin | Número | 1 | Frecuencia mínima (eventos/año) | ✅ |
| FrecuenciaMax | Número | 5 | Frecuencia máxima | ✅ |
| FrecuenciaMedio | Número | 3 | Frecuencia promedio | ❌ |
| FrecuenciaP90 | Número | 4.5 | Frecuencia P90 | ❌ |
| Apetito | Texto | Aversión | Tolerable, Aversión, Intolerable | ✅ |
| Categoría | Texto | Operacional | Clasificación | ❌ |
| Responsable | Texto | Juan Pérez | Owner del riesgo | ❌ |
| Color | Texto | #FB923C | Hex color para el marcador | ❌ |

### Ejemplo de Datos

```
ID    | Nombre                    | ImpactoMin | ImpactoMax | UnidadImpacto | FrecuenciaMin | FrecuenciaMax | Apetito
------|---------------------------|------------|------------|---------------|---------------|---------------|-------------
R1    | Reclamos laborales        | 6          | 25         | M             | 1             | 5             | Aversión
R2    | Incendio en depósitos     | 10         | 70         | M             | 0.2           | 0.3           | Aversión
R3    | Incumplimiento licencias  | 1          | 5          | M             | 3             | 7             | Intolerable
R4    | Accidentes con fatalidad  | 0.4        | 1          | M             | 10            | 10            | Intolerable
```

## Hoja 2: "Configuración" (Opcional)

Para importar también la configuración del heatmap.

| Parámetro | Valor |
|-----------|-------|
| Título | Risk Heatmap (POC) |
| Subtítulo | RISK & COMPLIANCE |
| FrecuenciaMin | 0.1 |
| FrecuenciaMax | 50 |
| ImpactoMin | 0.1 |
| ImpactoMax | 120 |
| UnidadImpacto | M |

## Validaciones en Importación

### Validaciones Críticas (Bloquean importación)
1. **ID único**: No puede haber IDs duplicados
2. **Campos requeridos**: No pueden estar vacíos
3. **ImpactoMax > ImpactoMin**: Validación de rango
4. **FrecuenciaMax > FrecuenciaMin**: Validación de rango
5. **Apetito válido**: Debe ser uno de los 3 valores permitidos
6. **UnidadImpacto válida**: Debe ser K, M o B

### Validaciones con Warning (Permiten importación)
1. **Color inválido**: Se asigna color por defecto según apetito
2. **Categoría vacía**: Se asigna "Sin categoría"
3. **Valores opcionales vacíos**: Se calculan automáticamente o se omiten

## Proceso de Importación

```
1. Usuario selecciona archivo Excel
   ↓
2. Sistema lee hoja "Riesgos"
   ↓
3. Validación de estructura (columnas requeridas presentes)
   ↓
4. Validación fila por fila
   ↓
5. Mostrar resumen: X válidos, Y con warnings, Z errores
   ↓
6. Usuario confirma importación
   ↓
7. Riesgos se agregan al proyecto actual
```

## Generación de Template

La aplicación debe tener un botón "Descargar Template Excel" que genere un archivo con:
- Headers correctos
- 2-3 filas de ejemplo
- Formato de celdas apropiado (número, texto)
- Comentarios en headers explicando cada columna
- Validación de datos en columna "Apetito" (dropdown)

## Ejemplo de Código

```typescript
function generateExcelTemplate() {
  const wb = XLSX.utils.book_new();
  
  // Datos de ejemplo
  const data = [
    {
      ID: 'R1',
      Nombre: 'Reclamos laborales',
      ImpactoMin: 6,
      ImpactoMax: 25,
      UnidadImpacto: 'M',
      FrecuenciaMin: 1,
      FrecuenciaMax: 5,
      Apetito: 'Aversión'
    },
    // ... más ejemplos
  ];
  
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Riesgos');
  
  XLSX.writeFile(wb, 'risk-import-template.xlsx');
}
```

## Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| "ID duplicado" | Dos riesgos con mismo ID | Cambiar uno de los IDs |
| "Impacto inválido" | Max < Min | Corregir valores |
| "Apetito no reconocido" | Typo en el valor | Usar exactamente: Tolerable, Aversión, Intolerable |
| "Unidad no válida" | Otro valor que no sea K/M/B | Corregir a K, M o B |
