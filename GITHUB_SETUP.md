# 📦 Guía Paso a Paso: Conectar con GitHub

## Paso 1: Verificar que Git está instalado

Abre tu terminal y ejecuta:

```bash
git --version
```

Si no está instalado, instálalo desde [git-scm.com](https://git-scm.com/download/mac)

## Paso 2: Inicializar Git en tu proyecto

```bash
cd /Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator
git init
```

## Paso 3: Agregar todos los archivos

```bash
git add .
```

## Paso 4: Hacer el primer commit

```bash
git commit -m "Initial commit: Proyecto Moodle Theme Creator con SQLite"
```

## Paso 5: Crear repositorio en GitHub

1. **Abre tu navegador** y ve a: [github.com/new](https://github.com/new)
2. **Llena el formulario**:
   - **Repository name**: `Moodle-Theme-Creator` (o el nombre que prefieras)
   - **Description**: "Plataforma educativa para gestión de cursos y módulos"
   - **Visibility**: 
     - ✅ **Public** (cualquiera puede verlo)
     - ⬜ **Private** (solo tú puedes verlo)
   - ⚠️ **NO marques** "Add a README file" (ya tienes uno)
   - ⚠️ **NO marques** "Add .gitignore" (ya tienes uno)
   - ⚠️ **NO marques** "Choose a license"
3. **Haz clic en "Create repository"**

## Paso 6: Copiar la URL del repositorio

Después de crear el repositorio, GitHub te mostrará una página con instrucciones. 

**Copia la URL** que aparece. Será algo como:
- `https://github.com/TU-USUARIO/Moodle-Theme-Creator.git`
- O si usas SSH: `git@github.com:TU-USUARIO/Moodle-Theme-Creator.git`

## Paso 7: Conectar tu proyecto local con GitHub

En tu terminal, ejecuta estos comandos (reemplaza `TU-USUARIO` y `TU-REPOSITORIO` con los tuyos):

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# Cambiar a la rama main (si es necesario)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

**Nota**: Si es la primera vez que usas Git, GitHub te pedirá autenticarte. Te pedirá:
- Tu **usuario de GitHub**
- Un **Personal Access Token** (no tu contraseña)

### Si necesitas crear un Personal Access Token:

1. Ve a: [github.com/settings/tokens](https://github.com/settings/tokens)
2. Haz clic en "Generate new token" → "Generate new token (classic)"
3. Dale un nombre como "Moodle Theme Creator"
4. Selecciona el scope `repo` (acceso completo a repositorios)
5. Haz clic en "Generate token"
6. **Copia el token** (solo se muestra una vez)
7. Úsalo como contraseña cuando Git te lo pida

## Paso 8: Verificar que funcionó

1. **Refresca la página** de tu repositorio en GitHub
2. Deberías ver todos tus archivos allí
3. ✅ **¡Listo!** Tu código está en GitHub

## Comandos útiles para el futuro

### Ver el estado de tus cambios:
```bash
git status
```

### Agregar cambios y subirlos:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver qué archivos cambiaron:
```bash
git diff
```

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Olvidé mi Personal Access Token
- Ve a [github.com/settings/tokens](https://github.com/settings/tokens)
- Genera uno nuevo
- Úsalo la próxima vez que hagas `git push`

## 📝 Próximo Paso: Conectar con Vercel

Una vez que tu código esté en GitHub, puedes seguir la guía en `DEPLOY.md` para conectarlo con Vercel.
