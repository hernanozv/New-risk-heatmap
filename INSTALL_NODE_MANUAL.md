# Instalacion Manual de Node.js Portable (SIN admin)

## Metodo 1: Script Automatico

```powershell
powershell -ExecutionPolicy Bypass -File setup-node-portable.ps1
```

Si el script funciona, espera 2-3 minutos y listo.

---

## Metodo 2: Manual (si el script falla)

### Paso 1: Descargar Node.js

1. Abre tu navegador
2. Ve a: https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip
3. Descarga el archivo ZIP (~30 MB)

### Paso 2: Extraer

1. Abre el ZIP descargado
2. Extrae todo el contenido a: `C:\Users\hzvirblis\node-portable\`
3. Deberia quedar asi:
   ```
   C:\Users\hzvirblis\node-portable\
   ├── node.exe
   ├── npm
   ├── npm.cmd
   └── ...otros archivos
   ```

### Paso 3: Configurar PATH

Abre PowerShell y ejecuta:

```powershell
$env:Path += ";C:\Users\hzvirblis\node-portable"
```

### Paso 4: Verificar

```powershell
node --version
npm --version
```

Deberias ver:
```
v20.11.0
10.2.4
```

### Paso 5: Hacer Permanente

Para que funcione en futuras sesiones:

```powershell
$profilePath = $PROFILE
$pathCommand = '$env:Path += ";C:\Users\hzvirblis\node-portable"'

if (-Not (Test-Path $profilePath)) {
    New-Item -ItemType File -Path $profilePath -Force
}

Add-Content -Path $profilePath -Value "`n# Node.js Portable"
Add-Content -Path $profilePath -Value $pathCommand
```

### Paso 6: Continuar con npm install

```powershell
cd "C:\Users\hzvirblis\New Heatmap"
npm install
```

---

## Metodo 3: Usar CodeSandbox o StackBlitz (Online)

Si ninguno de los metodos anteriores funciona, puedes desarrollar online:

1. **StackBlitz**: https://stackblitz.com
   - Crea nuevo proyecto Vite + React
   - Sube los archivos del proyecto
   - Desarrolla en el navegador

2. **CodeSandbox**: https://codesandbox.io
   - Similar a StackBlitz
   - Soporta npm install automaticamente

---

## Verificacion Final

Despues de cualquier metodo, verifica:

```powershell
node --version    # Debe mostrar v20.x.x
npm --version     # Debe mostrar 10.x.x
which node        # Debe mostrar la ruta
```

Si todo funciona, ejecuta:
```powershell
npm install
npm install tailwindcss-animate
npm run dev
```
