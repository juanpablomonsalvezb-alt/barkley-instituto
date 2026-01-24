#!/bin/bash

# Script de configuración inicial para auto-sync

PROJECT_DIR="/Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator"
cd "$PROJECT_DIR" || exit

echo "🚀 Configurando sincronización automática con GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Paso 1: Inicializar Git
if [ ! -d ".git" ]; then
    echo "1️⃣  Inicializando Git..."
    git init
    git add .
    git commit -m "Initial commit: Proyecto Moodle Theme Creator"
    echo "✅ Git inicializado"
    echo ""
else
    echo "✅ Git ya está inicializado"
    echo ""
fi

# Paso 2: Verificar/Crear remote
if ! git remote | grep -q origin; then
    echo "2️⃣  Configurando repositorio remoto..."
    echo ""
    echo "📝 Necesito la URL de tu repositorio de GitHub"
    echo "   Ejemplo: https://github.com/tu-usuario/tu-repositorio.git"
    echo ""
    read -p "👉 Ingresa la URL de GitHub: " GITHUB_URL
    
    if [ -z "$GITHUB_URL" ]; then
        echo "❌ URL no proporcionada. Saliendo..."
        exit 1
    fi
    
    git remote add origin "$GITHUB_URL"
    git branch -M main
    echo "✅ Repositorio remoto configurado"
    echo ""
    
    # Intentar hacer push inicial
    echo "3️⃣  Subiendo código inicial a GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Código subido exitosamente"
    else
        echo "⚠️  Error al subir. Verifica tus credenciales de GitHub."
        echo "   Puedes intentar manualmente con: git push -u origin main"
    fi
    echo ""
else
    echo "✅ Repositorio remoto ya configurado"
    echo ""
fi

# Paso 3: Hacer ejecutables los scripts
chmod +x auto-sync.sh
chmod +x setup-auto-sync.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Configuración completada!"
echo ""
echo "📋 Para iniciar la sincronización automática, ejecuta:"
echo "   bash auto-sync.sh"
echo ""
echo "💡 O usa el método más simple con GitHub Desktop (ver AUTO_SYNC.md)"
echo ""
