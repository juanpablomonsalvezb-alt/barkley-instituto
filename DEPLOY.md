# 🚀 Guía Rápida de Despliegue

## Conectar con GitHub y Vercel

### 1️⃣ Preparar el repositorio Git

```bash
# Si aún no has inicializado Git
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Migrated to SQLite and ready for Vercel"

# Crear rama main (si no existe)
git branch -M main
```

### 2️⃣ Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Crea un nuevo repositorio (público o privado)
3. **NO** inicialices con README, .gitignore o licencia (ya los tienes)
4. Copia la URL del repositorio (ej: `https://github.com/tu-usuario/tu-repo.git`)

### 3️⃣ Conectar y subir a GitHub

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# Subir el código
git push -u origin main
```

### 4️⃣ Conectar con Vercel

1. **Ir a Vercel**
   - Abre [vercel.com](https://vercel.com)
   - Haz clic en "Sign Up" o "Log In"
   - Inicia sesión con tu cuenta de GitHub

2. **Importar proyecto**
   - Haz clic en "Add New..." → "Project"
   - Selecciona tu repositorio de GitHub
   - Haz clic en "Import"

3. **Configurar proyecto**
   - **Framework Preset**: Deja en "Other" o "No Framework"
   - **Root Directory**: `./` (raíz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

4. **Variables de entorno**
   Antes de hacer clic en "Deploy", ve a "Environment Variables" y agrega:

   ```
   SESSION_SECRET = [genera uno con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   NODE_ENV = production
   DATABASE_URL = [ver nota sobre bases de datos abajo]
   ```

5. **Desplegar**
   - Haz clic en "Deploy"
   - Espera a que termine el build
   - ¡Listo! Tu app estará en `tu-proyecto.vercel.app`

### 5️⃣ Configurar base de datos para Vercel

⚠️ **IMPORTANTE**: SQLite local no funciona en Vercel. Necesitas una base de datos en la nube.

#### Opción A: Turso (SQLite en la nube - Más fácil)

1. Ve a [turso.tech](https://turso.tech) y crea cuenta
2. Crea una nueva base de datos
3. Copia la URL de conexión (ej: `libsql://tu-db.turso.io`)
4. En Vercel, agrega:
   - `DATABASE_URL` = `libsql://tu-db.turso.io`
   - `TURSO_AUTH_TOKEN` = (si Turso lo requiere)

#### Opción B: Vercel Postgres

1. En Vercel Dashboard → Storage → Create Database → Postgres
2. Vercel creará automáticamente las variables `POSTGRES_URL`
3. Necesitarás migrar el código de SQLite a PostgreSQL

### 6️⃣ Verificar despliegue

- Ve a la URL que Vercel te proporcionó
- Deberías ver tu aplicación funcionando
- Cada `git push` a `main` desplegará automáticamente

## 🔄 Actualizaciones Futuras

Cada vez que quieras actualizar:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Vercel desplegará automáticamente.

## ❓ Problemas Comunes

### Error: "Cannot find module"
- Asegúrate de que `npm install` se ejecute correctamente
- Verifica que todas las dependencias estén en `package.json`

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurada correctamente
- Para Turso, asegúrate de tener el token de autenticación si es necesario

### Error: "Build failed"
- Revisa los logs de build en Vercel
- Asegúrate de que `npm run build` funcione localmente primero

## 📞 Ayuda

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Turso](https://docs.turso.tech)
- [Issues en GitHub](https://github.com/tu-repo/issues)
