# 📹 Guía para Subir Videos al Home

## 📂 Ubicación de los Archivos

Los videos deben ir en la carpeta: **`client/public/`**

## 📝 Archivos Requeridos

### Videos (obligatorios)
1. **`video1.mp4`** - Video izquierdo
2. **`video2.mp4`** - Video derecho

### Posters/Miniaturas (opcionales)
3. **`video-poster-1.jpg`** - Miniatura del video 1
4. **`video-poster-2.jpg`** - Miniatura del video 2

## 📁 Estructura de Archivos

```
client/
└── public/
    ├── video1.mp4          ← Video 1 (izquierda)
    ├── video2.mp4          ← Video 2 (derecha)
    ├── video-poster-1.jpg  ← Poster video 1 (opcional)
    └── video-poster-2.jpg  ← Poster video 2 (opcional)
```

## 🎬 Especificaciones Recomendadas

### Formato de Video
- **Formato**: MP4 (H.264)
- **Resolución recomendada**: 1920x1080 (Full HD)
- **Aspect ratio**: 16:9
- **Tamaño máximo**: 50 MB por video (para carga rápida)
- **Duración recomendada**: 1-3 minutos

### Formato de Poster/Miniatura
- **Formato**: JPG o PNG
- **Resolución**: 1920x1080 px
- **Peso**: < 500 KB

## 🚀 Cómo Subir los Videos

### Opción 1: Manualmente (Interfaz de Replit)

1. En el panel izquierdo de Replit, navega a `client/public/`
2. Click derecho → "Upload file"
3. Selecciona `video1.mp4` y súbelo
4. Repite con `video2.mp4`
5. (Opcional) Sube las miniaturas `video-poster-1.jpg` y `video-poster-2.jpg`

### Opción 2: Por Comando (Terminal)

```bash
# Desde la terminal de Replit
cd client/public/

# Si tienes los archivos en tu computadora, usa el uploader de Replit
# o copia la URL si están en internet:
curl -o video1.mp4 "URL_DEL_VIDEO_1"
curl -o video2.mp4 "URL_DEL_VIDEO_2"
```

### Opción 3: Desde Google Drive u otro servicio

Si los videos están en Google Drive:
1. Comparte el archivo (público)
2. Obtén el link directo de descarga
3. Usa `curl` o `wget` para descargarlos

## 📋 Verificar que se Subieron Correctamente

Ejecuta en la terminal:

```bash
ls -lh client/public/*.mp4
```

Deberías ver:
```
video1.mp4
video2.mp4
```

## 🎨 Contenido Actual de los Videos

Según el código, los videos muestran:

### Video 1 (Izquierda)
- **Título**: "Nuestro Método Educativo"
- **Descripción**: "Descubre cómo el Instituto Barkley transforma el aprendizaje"

### Video 2 (Derecha)
- **Título**: "Resultados Comprobados"
- **Descripción**: "Conoce los logros de nuestros estudiantes"

## 🔄 Reiniciar el Servidor

Después de subir los videos:

```bash
# El servidor detectará los cambios automáticamente
# pero puedes reiniciarlo si es necesario:
npm run dev
```

## 🌐 Ver los Videos en el Home

1. Abre: `http://localhost:3001`
2. Scroll hacia abajo hasta la sección "Videos"
3. Los videos deberían aparecer y reproducirse

## ⚠️ Solución de Problemas

### Los videos no aparecen
- Verifica que los nombres sean exactamente: `video1.mp4` y `video2.mp4`
- Verifica que estén en `client/public/` (no en subdirectorios)
- Recarga el navegador con Cmd+Shift+R (recarga forzada)

### Los videos no se reproducen
- Verifica el formato: debe ser MP4 (H.264)
- Prueba con un video más pequeño primero
- Revisa la consola del navegador (F12) para ver errores

### Errores de tamaño de archivo
- Comprime los videos antes de subirlos
- Usa herramientas como HandBrake para reducir el tamaño
- Considera usar un servicio externo como YouTube o Vimeo

## 💡 Alternativa: Videos desde YouTube/Vimeo

Si los archivos son muy grandes, puedes usar videos desde YouTube o Vimeo.
En ese caso, necesitarías modificar el código en `Home.tsx`.

¿Quieres que te ayude a configurar videos desde YouTube/Vimeo en su lugar?

## 📞 Siguiente Paso

Una vez subidos los videos, verifica en:
```
http://localhost:3001
```

Y deberían aparecer automáticamente en la sección de videos del home.
