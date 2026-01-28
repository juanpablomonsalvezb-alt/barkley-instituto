# 🚀 Guía Rápida - Sistema de Links de Evaluación Gemini

## ✅ ¿Qué se implementó?

Se creó una interfaz completa para gestionar los links de evaluaciones de Gemini con **cálculo automático de fechas de liberación**.

## 📍 Acceso

```
URL: http://localhost:5000/evaluation-links-admin
```

## 🎯 Características Principales

### 1️⃣ Fechas Automáticas
- **NO necesitas calcular fechas manualmente**
- El sistema calcula automáticamente cuándo se libera cada evaluación
- Basado en el calendario oficial: Inicio 9 marzo 2026, módulos de 2 semanas

### 2️⃣ 4 Evaluaciones por Módulo
```
Evaluación 1: Miércoles Semana 1
Evaluación 2: Viernes Semana 1  
Evaluación 3: Miércoles Semana 2
Evaluación 4: Viernes Semana 2
```

### 3️⃣ Integración Real
- Usa las asignaturas reales del sistema
- Soporte para 15 módulos completos
- Los datos se guardan en la base de datos

## 📋 Cómo Usar

### Paso 1: Selecciona una Asignatura
- Ejemplo: "Matemática - 7° Básico"

### Paso 2: Selecciona un Módulo
- Módulos del 1 al 15

### Paso 3: Pega los Links de Gemini
- Pega el link de Gemini en cada campo
- El sistema valida automáticamente si el link es válido ✓
- Verás la fecha de liberación calculada automáticamente 📅

### Paso 4: Guarda
- Click en "Guardar Links"
- ¡Listo! Los links quedan guardados con sus fechas

## 📊 Ejemplo Visual

```
┌─────────────────────────────────────────────────┐
│  📝 Configuración de Evaluaciones Gemini        │
├─────────────────────────────────────────────────┤
│  1. Seleccionar Asignatura                      │
│     [ Matemática - 7° Básico ]  ✓               │
│                                                  │
│  2. Seleccionar Módulo                          │
│     [Módulo 1] [Módulo 2] ... [Módulo 15]      │
│                                                  │
│  3. Configurar Links                            │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ 1️⃣ Evaluación 1                         │   │
│  │ 📅 Se libera: miércoles 11 de marzo     │   │
│  │ [https://gemini.google.com/...]  ✓      │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ 2️⃣ Evaluación 2                         │   │
│  │ 📅 Se libera: viernes 13 de marzo       │   │
│  │ [https://gemini.google.com/...]  ✓      │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ... (Evaluación 3 y 4)                         │
│                                                  │
│  [Limpiar]  [💾 Guardar Links]                 │
└─────────────────────────────────────────────────┘
```

## 🔧 Archivos Creados/Modificados

✅ **Frontend**: `client/src/pages/EvaluationLinksAdmin.tsx`
✅ **Backend**: `server/evaluationLinksRoutes.ts`
✅ **Schema**: `shared/schema.ts` (tabla evaluationLinks)
✅ **Ruta**: `/evaluation-links-admin` en App.tsx

## ⚡ Para Iniciar el Servidor

```bash
npm run dev
```

El servidor corre en: `http://localhost:5000`

## 🎨 Validaciones Incluidas

- ✅ Verifica que sea una URL válida
- ✅ Verifica que sea un link de Gemini/Google
- ✅ Muestra ✓ verde si es válido
- ✅ Muestra ✗ rojo si es inválido
- ✅ Contador: "X de 4 evaluaciones configuradas"

## 💾 Persistencia

- Los links se guardan en SQLite
- Al volver, los links guardados se cargan automáticamente
- Puedes actualizar los links cuando quieras

## 🎓 Sistema de Fechas

El sistema considera:
- **Semanas de evaluación general** después de módulos 7 y 15
- **Martes y Viernes** como días de evaluación
- **Cálculo automático** para cada módulo

### Ejemplo Módulo 1:
```
Inicio: Lunes 9 marzo 2026
- Eval 1: Miércoles 11 marzo (Semana 1)
- Eval 2: Viernes 13 marzo (Semana 1)
- Eval 3: Miércoles 18 marzo (Semana 2)
- Eval 4: Viernes 20 marzo (Semana 2)
```

## 📞 ¿Necesitas Ayuda?

Ver documentación completa en: `EVALUATION_LINKS_IMPLEMENTATION.md`

---

**✨ ¡Todo listo para usar! Solo ve a `/evaluation-links-admin` y comienza a configurar.**
