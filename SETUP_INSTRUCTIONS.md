# 🚀 Instrucciones de Setup

## Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** >= 18.0.0 (Recomendado: 20.x LTS)
- **npm** >= 9.0.0

Verifica tu instalación:
```bash
node --version
npm --version
```

---

## Paso 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias definidas en `package.json`.

**Tiempo estimado**: 2-3 minutos (dependiendo de tu conexión)

---

## Paso 2: Instalar shadcn/ui Components

Después de que npm install termine, instala los componentes de UI base:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tooltip
```

Responde "Yes" cuando pregunte si deseas continuar.

**Tiempo estimado**: 1-2 minutos

---

## Paso 3: Instalar Dependencia Adicional

shadcn/ui requiere una dependencia adicional para animaciones:

```bash
npm install tailwindcss-animate
```

---

## Paso 4: Verificar Setup

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Deberías ver algo como:

```
  VITE v5.2.11  ready in 450 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Abre tu navegador en http://localhost:3000

Deberías ver la aplicación con:
- Header "Risk Heatmap"
- Sidebar con "Lista de Riesgos"
- Canvas principal con "Heatmap Canvas"
- Tabla con "Tabla de Detalles"

---

## Paso 5: Verificar Linting

```bash
npm run lint
```

No debería haber errores.

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta tests con Vitest |

---

## Estructura de Carpetas Creada

```
New Heatmap/
├── src/
│   ├── components/        # (Vacío, a crear)
│   ├── lib/
│   │   └── utils.ts       # Utilidades
│   ├── store/             # (Vacío, a crear)
│   ├── types/             # (Vacío, a crear)
│   ├── test/
│   │   └── setup.ts
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Entry point
│   ├── index.css          # Estilos globales
│   └── vite-env.d.ts      # Types de Vite
├── docs/                  # Documentación
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── ...otros archivos config
```

---

## Próximos Pasos

Una vez que el setup esté completo y funcionando:

1. ✅ Crear interfaces TypeScript en `/src/types/`
2. ✅ Implementar algoritmos en `/src/lib/algorithms/`
3. ✅ Crear store de Zustand en `/src/store/`
4. ✅ Desarrollar componentes en `/src/components/`

Consulta `docs/09_GUIA_IMPLEMENTACION.md` para el orden detallado de implementación.

---

## Troubleshooting

### Error: "Cannot find module '@/...'"
- Verifica que `vite.config.ts` tenga el alias configurado
- Reinicia el servidor de desarrollo

### Error en instalación de shadcn/ui
- Asegúrate de que `components.json` existe
- Verifica que `tailwind.config.js` esté correctamente configurado

### Puerto 3000 ya en uso
- Cambia el puerto en `vite.config.ts` (server.port)
- O mata el proceso que está usando el puerto

### Errores de TypeScript
- Ejecuta: `npm run build` para ver errores completos
- Verifica que todas las dependencias estén instaladas

---

## ¿Todo Funcionando?

Si el servidor corre sin errores y ves la interfaz básica en el navegador, ¡estás listo para comenzar el desarrollo! 🎉

Continúa con la implementación siguiendo:
- `docs/09_GUIA_IMPLEMENTACION.md` - Orden de desarrollo
- `docs/CHECKLIST_DESARROLLO.md` - Checklist completo
