#!/bin/bash

# Script para conectar el proyecto con GitHub
# Ejecuta: bash setup-github.sh

echo "🚀 Configurando Git para GitHub..."
echo ""

# Verificar si Git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Por favor instálalo desde: https://git-scm.com/download/mac"
    exit 1
fi

echo "✅ Git está instalado"
echo ""

# Verificar si ya es un repositorio Git
if [ -d ".git" ]; then
    echo "ℹ️  Ya existe un repositorio Git"
    read -p "¿Quieres reinicializarlo? (s/n): " respuesta
    if [ "$respuesta" = "s" ] || [ "$respuesta" = "S" ]; then
        rm -rf .git
        git init
        echo "✅ Repositorio reinicializado"
    fi
else
    git init
    echo "✅ Repositorio Git inicializado"
fi

echo ""
echo "📦 Agregando archivos..."

# Agregar todos los archivos
git add .

echo ""
echo "💾 Creando commit inicial..."

# Crear commit
git commit -m "Initial commit: Proyecto Moodle Theme Creator con SQLite y listo para Vercel"

echo ""
echo "✅ Commit creado exitosamente"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 PRÓXIMOS PASOS MANUALES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Ve a GitHub y crea un nuevo repositorio:"
echo "   👉 https://github.com/new"
echo ""
echo "2. NO marques ninguna opción (README, .gitignore, license)"
echo ""
echo "3. Copia la URL que GitHub te da (algo como:"
echo "   https://github.com/TU-USUARIO/TU-REPOSITORIO.git)"
echo ""
echo "4. Ejecuta estos comandos (reemplaza la URL con la tuya):"
echo ""
echo "   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Si necesitas ayuda, revisa el archivo GITHUB_SETUP.md"
echo ""
