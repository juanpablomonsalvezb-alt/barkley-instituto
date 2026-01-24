# 🎯 Conectar con GitHub desde Cursor (Interfaz Gráfica)

## Método 1: Usando la barra lateral de Source Control

### Paso 1: Abrir Source Control
1. En la barra lateral izquierda de Cursor, haz clic en el ícono de **Source Control** (o presiona `Cmd+Shift+G`)
2. Verás todos los archivos que han cambiado

### Paso 2: Inicializar Git (si no está inicializado)
1. Si ves el botón **"Initialize Repository"**, haz clic en él
2. Si no aparece, Git ya está inicializado

### Paso 3: Hacer el primer commit
1. En la sección "Changes", verás todos tus archivos
2. Haz clic en el botón **"+"** junto a "Changes" para agregar todos los archivos (o haz clic derecho → "Stage All Changes")
3. Arriba, en el campo de mensaje, escribe: `Initial commit: Proyecto Moodle Theme Creator`
4. Haz clic en el botón **"✓ Commit"** (o presiona `Cmd+Enter`)

### Paso 4: Publicar en GitHub
1. Después del commit, verás un botón que dice **"Publish Branch"** o **"Sync Changes"**
2. Haz clic en **"Publish Branch"**
3. Cursor te preguntará:
   - **¿Público o Privado?** → Elige según prefieras
   - **Nombre del repositorio** → `Moodle-Theme-Creator` (o el que prefieras)
4. Haz clic en **"Publish to GitHub"**
5. Cursor abrirá una ventana para autenticarte con GitHub (si no estás autenticado)
6. ¡Listo! Tu código se subirá automáticamente

## Método 2: Usando el menú de comandos

1. Presiona `Cmd+Shift+P` (o `Ctrl+Shift+P` en Windows/Linux)
2. Escribe: `Git: Publish to GitHub`
3. Selecciona la opción
4. Sigue las instrucciones en pantalla

## Método 3: Desde la barra de estado

1. Mira la barra inferior de Cursor
2. Verás el estado de Git (ej: "main" o "No repository")
3. Haz clic en el estado de Git
4. Selecciona **"Publish Branch"** o **"Push"**

## 🔐 Autenticación con GitHub

Si es la primera vez:
1. Cursor abrirá una ventana del navegador
2. Inicia sesión con tu cuenta de GitHub
3. Autoriza a Cursor para acceder a tus repositorios
4. Vuelve a Cursor y continúa

## 📝 Después de publicar

Una vez publicado, verás:
- Un botón **"Sync Changes"** para futuros cambios
- El nombre de tu rama (ej: "main")
- El estado de sincronización con GitHub

## 🔄 Para futuros cambios

1. Haz tus cambios en los archivos
2. Ve a Source Control (`Cmd+Shift+G`)
3. Agrega los archivos con el botón **"+"**
4. Escribe un mensaje de commit
5. Haz clic en **"✓ Commit"**
6. Haz clic en **"Sync Changes"** (o el botón de sincronización)

## ❓ Problemas comunes

### No veo el botón "Publish Branch"
- Asegúrate de haber hecho un commit primero
- Verifica que Git esté inicializado (deberías ver archivos en "Changes")

### Error de autenticación
- Ve a: Cursor → Settings → Accounts
- Conecta tu cuenta de GitHub desde ahí
- O usa el método de terminal con Personal Access Token

### No aparece Source Control
- Presiona `Cmd+Shift+G` para abrirlo
- O ve a: View → Source Control

## 💡 Consejo

Una vez conectado, cada cambio que hagas se puede subir fácilmente con:
1. `Cmd+Shift+G` → Agregar cambios → Commit → Sync

¡Es mucho más fácil que usar la terminal! 🎉
