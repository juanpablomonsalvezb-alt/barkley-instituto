# Moodle Theme Creator

Plataforma educativa para gestión de cursos, módulos y evaluaciones.

## 🚀 Características

- Sistema de gestión de niveles y asignaturas
- Módulos de aprendizaje con recursos multimedia
- Sistema de evaluaciones con generación de preguntas por IA
- Integración con Google Drive para sincronización de recursos
- Autenticación con Replit Auth
- Base de datos SQLite local (sin necesidad de provisionar base de datos externa)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd Moodle-Theme-Creator
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` y configura:
   - `SESSION_SECRET`: Genera uno con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `DATABASE_URL`: (Opcional) Ruta al archivo SQLite, por defecto `./taskManagement.db`
   - `REPL_ID` y `ISSUER_URL`: Solo si usas Replit Auth

4. **Inicializar la base de datos**
   ```bash
   npm run db:push
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5000`

## 🚢 Despliegue en Vercel

### Paso 1: Subir código a GitHub

1. **Inicializar repositorio Git** (si no lo has hecho)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Crear repositorio en GitHub**
   - Ve a [github.com](https://github.com) y crea un nuevo repositorio
   - Copia la URL del repositorio

3. **Conectar y subir código**
   ```bash
   git remote add origin <URL-DE-TU-REPOSITORIO>
   git branch -M main
   git push -u origin main
   ```

### Paso 2: Conectar con Vercel

1. **Ir a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub

2. **Importar proyecto**
   - Haz clic en "Add New..." → "Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración del proyecto

3. **Configurar el proyecto**
   - **Framework Preset**: Deja en blanco o selecciona "Other"
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

4. **Configurar variables de entorno**
   Antes de desplegar, agrega estas variables en Vercel:
   
   - Ve a "Environment Variables" en la configuración del proyecto
   - Agrega:
     - `SESSION_SECRET`: Genera uno con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: Para Vercel, usa una base de datos en la nube (ver nota abajo)
     - `REPL_ID` y `ISSUER_URL`: Solo si usas Replit Auth

5. **Desplegar**
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará tu aplicación
   - Una vez completado, obtendrás una URL (ej: `tu-proyecto.vercel.app`)

### Paso 3: Despliegue continuo

- Cada vez que hagas `git push` a la rama principal, Vercel desplegará automáticamente
- Puedes ver los deployments en el dashboard de Vercel

### Alternativa: Despliegue con Vercel CLI

Si prefieres usar la línea de comandos:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

## 📝 Notas Importantes para Vercel

⚠️ **SQLite en Vercel**: Vercel usa un sistema de archivos efímero (read-only), por lo que SQLite con archivos locales **NO funcionará** en producción en Vercel. Tienes estas opciones:

### Opción 1: Usar Turso (Recomendado - SQLite en la nube)

1. **Crear cuenta en Turso**
   - Ve a [turso.tech](https://turso.tech)
   - Crea una cuenta gratuita
   - Crea una nueva base de datos

2. **Obtener URL de conexión**
   - En el dashboard de Turso, copia la URL de conexión
   - Formato: `libsql://tu-db.turso.io`

3. **Configurar en Vercel**
   - Agrega `DATABASE_URL` con la URL de Turso
   - Instala el driver: `npm install @libsql/client`
   - Actualiza `server/db.ts` para usar Turso (ver ejemplo abajo)

### Opción 2: Usar Vercel Postgres

1. **Crear base de datos Postgres en Vercel**
   - En el dashboard de Vercel, ve a Storage → Create Database → Postgres
   - Sigue las instrucciones para crear la base de datos

2. **Configurar**
   - Vercel automáticamente creará las variables de entorno
   - Actualiza el código para usar PostgreSQL en lugar de SQLite

### Opción 3: Usar otra base de datos en la nube

- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **Neon** (PostgreSQL serverless)

### Ejemplo: Migrar a Turso

Si eliges Turso, necesitarás actualizar `server/db.ts`:

```typescript
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN, // Si usas autenticación
});

export const db = drizzle(client, { schema });
```

Y actualizar `drizzle.config.ts`:

```typescript
export default defineConfig({
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

## 🗂️ Estructura del Proyecto

```
Moodle-Theme-Creator/
├── client/          # Frontend React + Vite
├── server/          # Backend Express
├── shared/          # Código compartido (schemas, tipos)
├── api/             # Punto de entrada para Vercel
├── dist/            # Build de producción
└── vercel.json      # Configuración de Vercel
```

## 🔧 Scripts Disponibles

- `npm run dev`: Ejecuta el servidor en modo desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Ejecuta la aplicación en modo producción
- `npm run db:push`: Aplica los cambios del schema a la base de datos
- `npm run check`: Verifica tipos TypeScript

## 📚 Tecnologías Utilizadas

- **Frontend**: React 19, Vite, TailwindCSS, Radix UI
- **Backend**: Express, Node.js
- **Base de Datos**: SQLite (better-sqlite3)
- **ORM**: Drizzle ORM
- **Autenticación**: Replit Auth (OpenID Connect)
- **Validación**: Zod

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT
