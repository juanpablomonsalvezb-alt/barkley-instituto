# 🔍 Cómo Activar Source Control en Cursor

## Método 1: Desde el Menú de Comandos (Más Fácil)

1. **Presiona `Cmd+Shift+P`** (o `Ctrl+Shift+P` en Windows/Linux)
2. **Escribe**: `Git: Initialize Repository`
3. **Presiona Enter**
4. Esto inicializará Git en tu proyecto

Luego, para ver Source Control:
1. **Presiona `Cmd+Shift+P`** de nuevo
2. **Escribe**: `View: Show Source Control`
3. **Presiona Enter**
4. ¡Ahora deberías ver Source Control en la barra lateral!

## Método 2: Desde el Menú Superior

1. Ve al menú **View** (Vista) en la parte superior
2. Busca **"Source Control"** o **"SCM"**
3. Haz clic en él

## Método 3: Atajo de Teclado

- **Presiona `Cmd+Shift+G`** (Mac)
- **Presiona `Ctrl+Shift+G`** (Windows/Linux)

Esto debería abrir Source Control directamente.

## Método 4: Verificar si Git está Instalado

Abre la terminal integrada de Cursor:
1. **Presiona `` Ctrl+` ``** (backtick, arriba del Tab)
2. O ve a: **Terminal → New Terminal**
3. Escribe: `git --version`
4. Si no está instalado, instálalo desde: https://git-scm.com/download/mac

## Método 5: Activar desde la Barra de Estado

1. Mira la **barra inferior** de Cursor
2. Busca el ícono de Git o el texto que dice el estado de Git
3. Haz clic ahí para abrir Source Control

## Método 6: Si Nada Funciona - Usar Terminal Integrada

1. Abre la terminal en Cursor: `` Ctrl+` ``
2. Ejecuta estos comandos:

```bash
cd /Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator
git init
git add .
git commit -m "Initial commit"
```

Luego, para publicar en GitHub:
1. Ve a: https://github.com/new
2. Crea un repositorio nuevo
3. En la terminal de Cursor, ejecuta:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

## 🆘 Si Source Control Sigue Sin Aparecer

1. **Reinicia Cursor** completamente
2. Verifica que estés en la carpeta correcta del proyecto
3. Asegúrate de que Git esté instalado en tu Mac
4. Intenta usar el método de terminal (Método 6)

## 💡 Alternativa: Usar GitHub Desktop

Si prefieres una interfaz gráfica más simple:
1. Descarga GitHub Desktop: https://desktop.github.com
2. Abre GitHub Desktop
3. File → Add Local Repository
4. Selecciona tu carpeta: `/Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator`
5. GitHub Desktop te guiará para publicar en GitHub
