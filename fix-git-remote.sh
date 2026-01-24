#!/bin/bash

# Script para corregir la configuración del remote de Git

PROJECT_DIR="/Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator"
cd "$PROJECT_DIR" || exit

echo "🔧 Corrigiendo configuración de Git..."
echo ""

# Verificar el remote actual
echo "📋 Remote actual:"
git remote -v
echo ""

# Remover el remote incorrecto
if git remote | grep -q origin; then
    echo "🗑️  Removiendo remote incorrecto..."
    git remote remove origin
    echo "✅ Remote removido"
    echo ""
fi

# Solicitar la URL correcta de GitHub
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Necesito la URL correcta de tu repositorio de GitHub"
echo ""
echo "Ejemplos:"
echo "  https://github.com/tu-usuario/tu-repositorio.git"
echo "  git@github.com:tu-usuario/tu-repositorio.git"
echo ""
echo "Si aún no has creado el repositorio en GitHub:"
echo "  1. Ve a: https://github.com/new"
echo "  2. Crea un repositorio nuevo"
echo "  3. Copia la URL que te da GitHub"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "👉 Ingresa la URL de GitHub: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo "❌ URL no proporcionada. Saliendo..."
    exit 1
fi

# Agregar el remote correcto
echo ""
echo "🔗 Configurando remote correcto..."
git remote add origin "$GITHUB_URL"
git branch -M main

echo ""
echo "✅ Remote configurado correctamente"
echo ""
echo "📋 Nueva configuración:"
git remote -v
echo ""

# Intentar hacer push
echo "🚀 Intentando hacer push..."
read -p "¿Quieres hacer push ahora? (s/n): " DO_PUSH

if [ "$DO_PUSH" = "s" ] || [ "$DO_PUSH" = "S" ]; then
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ ¡Push exitoso! Tu código está en GitHub"
    else
        echo ""
        echo "⚠️  Error al hacer push. Posibles causas:"
        echo "   - No estás autenticado con GitHub"
        echo "   - El repositorio no existe en GitHub"
        echo "   - Problemas de red"
        echo ""
        echo "💡 Soluciones:"
        echo "   1. Verifica que el repositorio exista en GitHub"
        echo "   2. Autentica con GitHub (usa Personal Access Token)"
        echo "   3. Intenta manualmente: git push -u origin main"
    fi
else
    echo ""
    echo "💡 Puedes hacer push más tarde con:"
    echo "   git push -u origin main"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Configuración completada"
echo ""
