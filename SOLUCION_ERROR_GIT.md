# 🔧 Solución: Error "Failed to push" - gitsafe

## El Problema

El error que ves:
```
fatal: unable to look up gitsafe (port 5418) (nodename nor servname provided, or not known)
```

Significa que el **remote de Git está mal configurado**. En lugar de apuntar a GitHub, está intentando conectarse a algo llamado "gitsafe" en el puerto 5418, que no existe.

## ✅ Solución Rápida

### Opción 1: Usar el Script Automático (Más Fácil)

```bash
cd /Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator
bash fix-git-remote.sh
```

El script te pedirá la URL correcta de GitHub y lo configurará automáticamente.

### Opción 2: Comandos Manuales

Abre la terminal en Cursor (`` Ctrl+` ``) y ejecuta:

```bash
# 1. Ver el remote actual (incorrecto)
git remote -v

# 2. Remover el remote incorrecto
git remote remove origin

# 3. Agregar el remote correcto (reemplaza con TU URL)
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# 4. Verificar que está correcto
git remote -v

# 5. Intentar push de nuevo
git push -u origin main
```

## 📝 Si Aún No Tienes Repositorio en GitHub

1. **Ve a GitHub**: https://github.com/new
2. **Crea un repositorio nuevo**:
   - Nombre: `Moodle-Theme-Creator` (o el que prefieras)
   - NO marques README, .gitignore, ni license
   - Haz clic en "Create repository"
3. **Copia la URL** que GitHub te muestra
4. **Úsala en el paso 3** de arriba

## 🔐 Problemas de Autenticación

Si después de corregir el remote, el push falla por autenticación:

### Opción A: Personal Access Token

1. Ve a: https://github.com/settings/tokens
2. Generate new token → Generate new token (classic)
3. Dale un nombre: "Moodle Theme Creator"
4. Selecciona scope: `repo`
5. Generate token
6. **Copia el token** (solo se muestra una vez)
7. Úsalo como contraseña cuando Git te lo pida

### Opción B: GitHub Desktop

1. Descarga: https://desktop.github.com
2. Abre GitHub Desktop
3. File → Add Local Repository
4. Selecciona tu carpeta
5. Publish repository
6. GitHub Desktop maneja la autenticación automáticamente

## ✅ Verificar que Funcionó

Después de corregir, verifica:

```bash
git remote -v
```

Deberías ver algo como:
```
origin  https://github.com/tu-usuario/tu-repositorio.git (fetch)
origin  https://github.com/tu-usuario/tu-repositorio.git (push)
```

**NO** debería aparecer "gitsafe" ni el puerto 5418.

## 🚀 Después de Corregir

Una vez configurado correctamente, podrás:
- Hacer push: `git push`
- Hacer pull: `git pull`
- Ver cambios: `git status`

## 💡 Prevenir Este Error en el Futuro

Asegúrate de usar siempre la URL correcta de GitHub:
- ✅ `https://github.com/usuario/repositorio.git`
- ✅ `git@github.com:usuario/repositorio.git`
- ❌ NO uses URLs de otros servicios sin configurarlos correctamente
