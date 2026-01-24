#!/bin/bash

# Script de sincronización automática con GitHub
# Este script monitorea cambios y los sincroniza automáticamente

PROJECT_DIR="/Users/juanpablomonsalvez/Downloads/Moodle-Theme-Creator"
cd "$PROJECT_DIR" || exit

echo "🔄 Iniciando sincronización automática con GitHub..."
echo ""

# Verificar si Git está inicializado
if [ ! -d ".git" ]; then
    echo "⚠️  Git no está inicializado. Inicializando..."
    git init
    git add .
    git commit -m "Initial commit: Auto-sync setup"
    echo "✅ Git inicializado"
    echo ""
    echo "📝 IMPORTANTE: Necesitas conectar con GitHub primero:"
    echo "   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    exit 1
fi

# Verificar si hay un remote configurado
if ! git remote | grep -q origin; then
    echo "⚠️  No hay repositorio remoto configurado."
    echo "   Ejecuta: git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git"
    exit 1
fi

# Función para sincronizar
sync_to_github() {
    echo "📦 Detectados cambios, sincronizando..."
    
    # Agregar todos los cambios
    git add .
    
    # Crear commit con timestamp
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        # Hacer push
        git push origin main 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Sincronizado exitosamente a las $(date '+%H:%M:%S')"
        else
            echo "⚠️  Error al hacer push. Verifica tu conexión y credenciales."
        fi
    else
        echo "ℹ️  No hay cambios para sincronizar"
    fi
}

# Sincronizar una vez al inicio
sync_to_github

echo ""
echo "👀 Monitoreando cambios (presiona Ctrl+C para detener)..."
echo ""

# Monitorear cambios cada 30 segundos
while true; do
    sleep 30
    
    # Verificar si hay cambios
    if ! git diff-index --quiet HEAD --; then
        sync_to_github
        echo ""
    fi
done
