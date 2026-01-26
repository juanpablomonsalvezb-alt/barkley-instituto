# 📚 Sistema de PDFs Automático por Carpeta de Drive

## ✅ IMPLEMENTACIÓN COMPLETADA

### 🎯 Objetivo Logrado:
Solo das el link de la carpeta de Drive, el sistema detecta automáticamente qué PDF corresponde a cada módulo basándose en el nombre del archivo.

---

## 🚀 Cómo Funciona:

### 1. Preparar los PDFs en Drive

**Estructura de carpeta:**
```
📁 Matemática_7B/
  ├─ MATSM25E7B-8-17.pdf    (Módulo 1: páginas 8-17)
  ├─ MATSM25E7B18-26.pdf    (Módulo 2: páginas 18-26)
  ├─ MATSM25E7B27-35.pdf    (Módulo 3: páginas 27-35)
  └─ ...
```

**Requisitos:**
- Los archivos deben tener el rango de páginas en el nombre
- Formato: cualquier texto + **número-número** (ej: `8-17`, `18-26`)
- Los PDFs deben ser públicos o compartidos

### 2. Obtener el Folder ID de Drive

**Opción A: Desde la URL**
```
https://drive.google.com/drive/folders/1ABC123XYZ456
                                          ↑
                                    Este es el ID
```

**Opción B: Compartir la carpeta**
1. Clic derecho en la carpeta → "Compartir"
2. Cambiar a "Cualquiera con el enlace"
3. Copiar el enlace
4. Extraer el ID

---

## 🔧 Backend Implementado:

### Endpoints Nuevos:

**GET /api/drive/folder/:folderId/pdfs**
- Lista todos los PDFs de una carpeta de Drive
- Extrae automáticamente el rango de páginas del nombre
- Retorna: `[{ id, name, webViewLink, pageRange: {start, end} }]`

**POST /api/textbooks/auto-match**
- Input: `{ folderId, modulePagesConfig }`
- Output: Matching automático de PDFs a módulos
- Compara rangos de páginas del nombre vs configuración

### Funciones en googleDrive.ts:

```typescript
listPDFsFromFolder(folderId)
  → Lista PDFs de la carpeta

extractPageRangeFromFilename(filename)
  → Extrae "8-17" del nombre "MATSM25E7B-8-17.pdf"

matchPDFsToModules(pdfs, modulePagesConfig)
  → Asigna cada PDF a su módulo correspondiente
```

---

## 📊 Schema Actualizado:

**Tabla: textbook_configs**
```
- driveFolderId: ID de la carpeta de Drive
- pdfUrl: (opcional, legacy)
- modulePagesConfig: { "module_1": { start: 8, end: 17 }, ... }
- modulePDFsMap: { "module_1": { pdfUrl: "...", fileName: "..." }, ... }
```

---

## 🎨 Interfaz de Configuración (A COMPLETAR):

La interfaz necesita ser actualizada para:

1. **Campo nuevo**: "URL de Carpeta de Drive" en lugar de "URL del PDF"
2. **Botón "Auto-detectar"**: 
   - Lee la carpeta
   - Lista los PDFs encontrados
   - Hace el matching automático
   - Muestra preview del resultado
3. **Vista previa**:
   ```
   Módulo 1 (8-17) → MATSM25E7B-8-17.pdf ✓
   Módulo 2 (18-26) → MATSM25E7B18-26.pdf ✓
   ...
   ```

---

## 🔄 Flujo Completo:

### Para el Admin:

1. Ve a `/textbook-config-new`
2. Selecciona Nivel y Asignatura
3. **Pega la URL de la carpeta de Drive** (en lugar de PDF individual)
4. Click "Auto-detectar PDFs"
5. Sistema muestra matching:
   - Módulo 1 → MATSM25E7B-8-17.pdf ✓
   - Módulo 2 → MATSM25E7B18-26.pdf ✓
6. Confirmas y guardas
7. ¡Listo!

### Para el Estudiante:

1. Entra a un módulo
2. El visor carga el PDF específico de ese módulo
3. Solo ve las páginas de ese PDF
4. No puede ver otros módulos

---

## ✅ Estado Actual:

- ✅ Backend: Funciones de Drive implementadas
- ✅ Endpoints: API para listar y hacer matching
- ✅ Schema: Base de datos actualizada
- ⏳ Frontend: Interfaz necesita ser actualizada
- ⏳ Visor: Necesita usar modulePDFsMap

---

## 🔧 Próximos Pasos para Completar:

### 1. Actualizar TextbookConfigNew.tsx

Reemplazar:
```typescript
// Antes
<Input placeholder="URL del PDF" />

// Después
<Input placeholder="URL de la Carpeta de Drive" />
<Button onClick={handleAutoDetect}>Auto-detectar PDFs</Button>
```

### 2. Implementar Auto-detección

```typescript
const handleAutoDetect = async () => {
  const folderId = extractFolderIdFromUrl(driveFolderUrl);
  
  // Listar PDFs
  const pdfs = await fetch(`/api/drive/folder/${folderId}/pdfs`).then(r => r.json());
  
  // Auto-match
  const result = await fetch('/api/textbooks/auto-match', {
    method: 'POST',
    body: JSON.stringify({ folderId, modulePagesConfig })
  }).then(r => r.json());
  
  // Mostrar preview
  setMatchedPDFs(result.matches);
};
```

### 3. Actualizar el Visor

```typescript
// En CoursePlayer, en lugar de usar textbookPdfUrl
// Usar el PDF específico del módulo desde modulePDFsMap

const modulePDF = textbookData.modulePDFsMap[`module_${moduleNumber}`];
if (modulePDF) {
  <TextbookViewer pdfUrl={modulePDF.pdfUrl} ... />
}
```

---

## 📝 Ejemplo de Uso Real:

**Carpeta en Drive:**
```
Matemática 7° Básico/
  MATSM25E7B-8-17.pdf
  MATSM25E7B18-26.pdf
  MATSM25E7B27-35.pdf
  MATSM25E7B36-44.pdf
  ...
```

**Configuración:**
```json
{
  "driveFolderId": "1ABC123XYZ456",
  "modulePagesConfig": {
    "module_1": { "start": 8, "end": 17 },
    "module_2": { "start": 18, "end": 26 },
    "module_3": { "start": 27, "end": 35 }
  },
  "modulePDFsMap": {
    "module_1": { 
      "pdfUrl": "https://drive.google.com/file/d/...",
      "fileName": "MATSM25E7B-8-17.pdf" 
    },
    "module_2": { 
      "pdfUrl": "https://drive.google.com/file/d/...",
      "fileName": "MATSM25E7B18-26.pdf" 
    }
  }
}
```

**Resultado:**
- Módulo 1 muestra solo MATSM25E7B-8-17.pdf
- Módulo 2 muestra solo MATSM25E7B18-26.pdf
- etc.

---

## 🎉 Ventajas del Sistema:

✅ **Automático**: Solo pegas la carpeta, todo se detecta solo
✅ **Escalable**: Funciona con cualquier cantidad de módulos
✅ **Flexible**: Soporta cualquier patrón de nombres con números
✅ **Seguro**: Cada módulo solo ve su PDF
✅ **Mantenible**: Cambias el PDF en Drive y automáticamente se actualiza

---

## 🔑 Requisitos:

- Google Drive API configurada (ya está)
- Credenciales en variables de entorno
- PDFs con nombres que incluyan el rango de páginas
- Carpeta compartida públicamente

---

