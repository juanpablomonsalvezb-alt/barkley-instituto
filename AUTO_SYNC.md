# 🔄 Sincronización Automática con GitHub

Tienes **3 opciones** para sincronizar automáticamente tus cambios locales con GitHub:

---

## 🎯 Opción 1: GitHub Desktop (MÁS FÁCIL - Recomendado)

GitHub Desktop tiene sincronización automática integrada.

### Instalación:
1. Descarga: https://desktop.github.com
2. Instala la aplicación
3. Inicia sesión con tu cuenta de GitHub

### Configuración:
1. Abre GitHub Desktop
2. **File → Add Local Repository**
3. Selecciona: `/Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator`
4. Si no tienes repositorio en GitHub, haz clic en **"Publish repository"**

### Uso:
- **Sincronización automática**: GitHub Desktop detecta cambios automáticamente
- **Commit y Push**: Haz clic en el botón **"Commit to main"** y luego **"Push origin"**
- **Auto-sync**: Puedes activar "Automatically sync" en Settings → Options

### Ventajas:
- ✅ Interfaz gráfica muy fácil
- ✅ Muestra cambios visualmente
- ✅ Maneja conflictos automáticamente
- ✅ Sincronización con un clic

---

## 🚀 Opción 2: Script Automático (Terminal)

Un script que monitorea cambios y los sincroniza automáticamente.

### Configuración inicial (solo una vez):

```bash
cd /Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator
bash setup-auto-sync.sh
```

Este script te pedirá:
- La URL de tu repositorio de GitHub
- Configurará todo automáticamente

### Iniciar sincronización automática:

```bash
bash auto-sync.sh
```

Este script:
- ✅ Monitorea cambios cada 30 segundos
- ✅ Hace commit automáticamente
- ✅ Hace push a GitHub automáticamente
- ✅ Muestra el estado en tiempo real

### Para detener:
Presiona `Ctrl+C` en la terminal

### Ejecutar en segundo plano (opcional):

```bash
nohup bash auto-sync.sh > sync.log 2>&1 &
```

Para ver los logs:
```bash
tail -f sync.log
```

---

## ⚙️ Opción 3: Git Hooks (Avanzado)

Configuración que sincroniza automáticamente después de cada cambio.

### Configurar:

```bash
cd /Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator

# Crear hook post-commit
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
git push origin main
EOF

chmod +x .git/hooks/post-commit
```

### Cómo funciona:
- Cada vez que hagas `git commit`, automáticamente hará `git push`
- Funciona con cualquier método de commit (Cursor, terminal, etc.)

### Uso:
```bash
git add .
git commit -m "Mis cambios"
# Automáticamente se sincroniza con GitHub
```

---

## 📊 Comparación de Opciones

| Característica | GitHub Desktop | Script Auto | Git Hooks |
|---------------|----------------|-------------|-----------|
| Facilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Automático | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Visual | ✅ Sí | ❌ No | ❌ No |
| Configuración | Fácil | Media | Avanzada |
| Recomendado para | Principiantes | Intermedios | Avanzados |

---

## 🎯 Recomendación

**Para ti, recomiendo GitHub Desktop** porque:
- ✅ Es la opción más fácil
- ✅ Tienes control visual de los cambios
- ✅ Maneja errores automáticamente
- ✅ Funciona perfectamente con Cursor

---

## 🔧 Solución de Problemas

### Error: "Permission denied"
```bash
chmod +x auto-sync.sh
chmod +x setup-auto-sync.sh
```

### Error: "Remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
```

### Error: "Authentication failed"
- GitHub Desktop: Ve a Preferences → Accounts y reconecta
- Terminal: Usa Personal Access Token en lugar de contraseña

---

## 💡 Consejos

1. **Haz commits frecuentes**: Es mejor hacer muchos commits pequeños que uno grande
2. **Revisa antes de sincronizar**: Asegúrate de que los cambios estén correctos
3. **Usa mensajes descriptivos**: "Agregué función X" es mejor que "cambios"

---

## 🚀 Inicio Rápido

**Si quieres empezar YA con GitHub Desktop:**

1. Descarga: https://desktop.github.com
2. Instala y abre
3. File → Add Local Repository
4. Selecciona tu carpeta del proyecto
5. Publish repository
6. ¡Listo! Ahora solo haz clic en "Commit" y "Push" cuando hagas cambios

**Si prefieres el script automático:**

```bash
bash setup-auto-sync.sh
# Luego en otra terminal:
bash auto-sync.sh
```
