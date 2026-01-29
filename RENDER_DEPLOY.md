# 🚀 Deploy en Render.com (GRATIS)

## ✅ Por qué Render para este proyecto:

- ✅ **Completamente GRATIS** (tier gratuito permanente)
- ✅ **Soporta SQLite** con disco persistente
- ✅ **Deploy automático** desde GitHub
- ✅ **No requiere cambios** en el código
- ✅ **SSL gratis** incluido

## 📋 Pasos para Deploy:

### 1. Crear cuenta en Render

1. Ve a: https://render.com
2. Haz clic en "Get Started"
3. Regístrate con tu cuenta de GitHub (recomendado)

### 2. Conectar tu repositorio

1. En el dashboard de Render, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu cuenta de GitHub si aún no lo has hecho
4. Busca y selecciona el repositorio: `barkley-instituto`
5. Haz clic en "Connect"

### 3. Configurar el servicio

Render detectará automáticamente el archivo `render.yaml` y configurará:

- ✅ **Name**: barkley-instituto
- ✅ **Environment**: Node
- ✅ **Build Command**: `npm install && npm run build`
- ✅ **Start Command**: `node dist/index.cjs`
- ✅ **Plan**: Free
- ✅ **Variables de entorno**: NODE_ENV, SESSION_SECRET, DATABASE_URL
- ✅ **Disco persistente**: 1GB para SQLite

**Solo haz clic en "Create Web Service"** y Render hará el resto.

### 4. Esperar el deploy (3-5 minutos)

Render automáticamente:
1. Clonará tu repositorio
2. Instalará dependencias
3. Ejecutará el build
4. Creará el disco persistente
5. Iniciará tu aplicación

### 5. ¡Listo! 🎉

Una vez completado, Render te dará una URL como:
```
https://barkley-instituto.onrender.com
```

## 🔄 Deploys automáticos

Cada vez que hagas `git push` a la rama `main`, Render automáticamente:
- Detectará los cambios
- Hará un nuevo build
- Desplegará la nueva versión
- Mantendrá tu base de datos intacta

## ⚙️ Variables de Entorno

Ya están configuradas en `render.yaml`:

- **NODE_ENV**: `production`
- **SESSION_SECRET**: Se genera automáticamente (seguro)
- **DATABASE_URL**: `/var/data/taskManagement.db` (disco persistente)

## 🐌 Nota sobre el tier gratuito:

- Tu app puede "dormirse" después de 15 min de inactividad
- El primer request después de dormir toma ~30-60 segundos
- Para mantenerla activa, considera usar un servicio de "ping" gratuito

## 🆘 Solución de problemas

Si el deploy falla:

1. Ve a "Logs" en el dashboard de Render
2. Busca el error específico
3. Comparte los logs para ayudarte

## 🔗 Enlaces útiles

- Dashboard: https://dashboard.render.com
- Documentación: https://render.com/docs
- Status: https://status.render.com
